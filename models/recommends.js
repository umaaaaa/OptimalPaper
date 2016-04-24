"use strict";

var db = require('./db');
var papers = require('./papers');
var reviews = require('./reviews');

var recommends = {};

//paper_idに関連した論文を返す
function paperUserPaper(paper_id){
  //paper -> user -> paper
  return db.queryPromise(
      'select count(*) as count, pup.paper_id '+ //各論文の数
      'from review as pu '+ //paper -> user
      'join review as pup on pup.user_id=pu.user_id '+ //paper -> user -> paper
      'where pu.paper_id=? and pup.paper_id<>? '+ //p, pup
      'group by pup.paper_id', //論文毎にまとめる
      [paper_id, paper_id])
    .then(function(rows) {
      var total = rows.reduce(function(acc, row){return acc + row.count;}, 0);
      return rows.map(function(row){row.ratio = row.count/total; return row;});
    });
}

function userPaperUserPaper(user_id){
  //user -> paper -> user -> paper
  return db.queryPromise(
      'select count(*) as count, upup.paper_id '+ //各論文の数
      'from review as up '+ //user -> paper
      'join review as upu on upu.paper_id=up.paper_id '+ //user -> paper -> user
      'join review as upup on upup.user_id=upu.user_id '+ //user -> paper -> user -> paper
      'where up.user_id=? and upu.user_id<>? '+
      'and exists (select 1 from review as up2 where up2.user_id=? and upup.paper_id=up2.paper_id) '+ //u, upu, (up)up
      'group by upup.paper_id', //論文毎にまとめる
      [user_id, user_id, user_id])
    .then(function(rows) {
      var total = rows.reduce(function(acc, row){return acc + row.count;}, 0);
      return rows.map(function(row){row.ratio = row.count/total; return row;});
    });
}

function hashRatio(rows) {
  var hash = {};
  for (let i in rows) {
    hash[rows[i].paper_id] = rows[i].ratio;
  }
  return hash;
}

function rating(paper_id) {
  return reviews.getAvgRateByPaper(paper_id);
}

function recent(paper_id) {
  return db.queryPromise(
      'select max(reviewed_at) as date from review where paper_id=?',
      [paper_id])
    .then(function(rows) {
      if (rows.length != 1) throw new Error();
      return rows[0].date.valueOf();
    });
}

function optimal(ratio){
  return function(paper_id) {
    var rat = ratio[paper_id];
    return rat ? Promise.resolve(rat) : rating(paper_id);
  }
}

function addFactor(fun) {
  return function (ov, index){
    return (ov.paper_id ? fun(ov.paper_id) : Promise.resolve(0))
      .then(function(factor) {
        ov.factor = factor;
        ov.index = index;
        return ov;
      });
  };
}

//おすすめ度
recommends.addFactors = function (ovs, orderby, user){
  if (orderby == 'rating') return Promise.all(ovs.map(addFactor(rating)));
  if (orderby == 'recent') return Promise.all(ovs.map(addFactor(recent)));
  if (orderby == 'optimal' && user) {
    return userPaperUserPaper(user.id)
      .then(function(upup){
        var ratio = hashRatio(upup);
        return Promise.all(ovs.map(addFactor(optimal(ratio))));
      });
  }
  throw new Error('unsupport factor');
}


function createOverviews(ps, max) {
  return ps.then(function(pup) {
      return pup.sort(function(a,b){return b.ratio - a.ratio;})
        .slice(0, max)
    })
    .then(function(ps) {
      return Promise.resolve(ps)
        .then(reviews.attachToOverviews)
        .then(papers.attachToOverviews);
    });
}

recommends.getByPaper = function (paper_id, max) {
  return createOverviews(paperUserPaper(paper_id), max);
};

recommends.getByUser = function (user_id, max) {
  return createOverviews(userPaperUserPaper(user_id), max);
}

module.exports = recommends;

