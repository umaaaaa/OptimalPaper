"use strict";

var db = require('./db');
var cinii = require('./cinii');
var reviews = require('./reviews');
var recommends = require('./recommends');

var papers = {};

var repos = { cinii: 1 }

papers.getPaperId = function (repo, id_repo) {
  return new Promise(function(resolve, reject) {
    db.query('select id from paper where repo=? and id_repo=?',
      [repo, id_repo],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length != 1) return resolve(null);
        resolve(rows[0].id);
      });
  });
};

papers.getIdRepo = function (paper_id) {
  return new Promise(function(resolve, reject) {
    db.query('select repo,id_repo from paper where id=?',
      [paper_id],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length == 0) return reject(new Error('Not exist'));
        resolve(rows[0]);
      });
  });
};

papers.fetchDetail = function (repo, id_repo) {
  return (repo==repos.cinii ? cinii.fetchDetailByNaid(id_repo):
       Promise.reject(new Error("Unknown repository")))
    .then(function(detail) {
      return papers.getPaperId(repo, id_repo)
        .then(function(paper_id) {
          if(paper_id)
            detail.paper_id = paper_id;
          return detail;
        })
    });
};

papers.fetchDetailWithRecommend = function(repo, id_repo, user) {
  return papers
    .fetchDetail(repo, id_repo)
    .then(function(detail) {
      if (!detail.paper_id) return { detail:detail };

      return reviews.getByPaper(detail.paper_id)
        .then(function(revs) {
          return {
            detail: detail,
            reviews: revs
          };
        });
    })
    .then(function(res) {
      if (!res.detail.paper_id) return res;

      return recommends.getByPaper(res.detail.paper_id, 4, user)
        .then(function (rcm) {
          res.recommends = rcm;
          return res;
        });
    });
};

papers.getRecent = function (count) {
  //count回cinii APIを呼ぶので制限
  var limited_count = Math.max(count, 10);

  return reviews.getRecent(limited_count)
    .then(function(revs) {
      return Promise.all(revs.map(function(rev){
        return papers.getIdRepo(rev.paper_id)
          .then(function(paper_repo){
            return {
              review: rev,
              paper_repo: paper_repo
            };
          })
          .then(function(res){
            return papers
              .fetchDetail(res.paper_repo.repo, res.paper_repo.id_repo)
              .then(function(detail){
                return {
                  review: res.review,
                  paper: detail
                };
              });
          });
      }));
    });
}

papers.search = function(keyword, orderby, user) {
  return cinii.searchOrderByCited(keyword)
    .then(function(items){
      return Promise.all(
        items.map(function(item) {
          return recommends.factor(item.repo, item.id_repo, orderby, user)
            .then(function(factor) {
              return {
                item: item,
                factor: factor
              };
            });
          }));
    })
    .then(function (factored_items) {
      return factored_items.sort(function(a,b) {
        return a.factor - b.factor;
      });
    });
}

module.exports = papers;
