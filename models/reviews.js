"use strict";

var reviews = module.exports = {};

var db = require('./db');
var papers = require('./papers');

reviews.insert = function (repo, id_repo, rate, comment, user) {
  if (!user) return Promise.reject(new Error('Need login'));

  return papers.getOrSet(repo, id_repo)
    .then(function(paper_id) {
      return new Promise(function(resolve, reject) {
        var now = new Date();
        db.query(
          'insert into review set ?',
          {
            user_id: user.id,
            paper_id: paper_id,
            rate: rate,
            comment: comment,
            reviewed_at: now
          },
          function(err, res) {
            if (err) return reject(err);
            resolve(res.insertId);
          });
      });
    });
};


reviews.getByPaper = function (paper_id) {
  return new Promise(function(resolve, reject) {
    db.query(
      'select review.id,user_id,paper_id,rate,comment,reviewed_at,name,icon_url ' +
      'from review join user on user.id=user_id where paper_id=? '+
      'order by reviewed_at desc',
      [paper_id],
      function(err, rows) {
        if (err) return reject(err);

        resolve(rows.map(function(row){
          return {
            id: row.id,
            paper_id: row.paper_id,
            rate: row.rate,
            comment: row.comment,
            reviewed_at: row.reviewed_at,
            user: {
              id: row.user_id,
              name: row.name,
              icon_url: row.icon_url }
          };
        }));
      });
  });
};

reviews.getByUser = function (user) {
  console.log(user);
  return new Promise(function(resolve, reject) {
    db.query(
      'select id,user_id,paper_id,rate,comment,reviewed_at ' +
      'from review where user_id=? '+
      'order by reviewed_at desc',
      [user.id],
      function(err, rows) {
        if (err) return reject(err);

        resolve(rows.map(function(row){
          return {
            id: row.id,
            paper_id: row.paper_id,
            rate: row.rate,
            comment: row.comment,
            reviewed_at: row.reviewed_at,
            user: user
          };
        }));
      });
  });
};

reviews.getRecentByPaper = function (paper_id) {
  return new Promise(function(resolve, reject) {
    db.query(
      'select review.id,user_id,paper_id,rate,comment,reviewed_at,name,icon_url ' +
      'from review join user on user.id=user_id where paper_id=? '+
      'order by reviewed_at desc limit 1',
      [paper_id],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length != 1) return resolve(null);

        var row = rows[0];
        resolve({
          id: row.id,
          paper_id: row.paper_id,
          rate: row.rate,
          comment: row.comment,
          reviewed_at: row.reviewed_at,
          user: {
            id: row.user_id,
            name: row.name,
            icon_url: row.icon_url }
        });
      });
  });
};

reviews.getRecent = function (count) {
  return new Promise(function(resolve, reject) {
    db.query(
        'select review.id,paper_id,user_id,rate,comment,reviewed_at,name,icon_url '+
        'from (select paper_id as p_id,max(reviewed_at) as rr_at '+
        '      from review group by paper_id order by rr_at desc limit ?) as rc '+
        'join review on paper_id=p_id and reviewed_at=rr_at '+
        'join user on user.id=user_id '+
        'order by reviewed_at desc',
        [count],
        function(err, rows) {
          if (err) return reject(err);
          resolve(rows.map(function(row){
            return {
              id: row.id,
              paper_id: row.paper_id,
              rate: row.rate,
              comment: row.comment,
              reviewed_at: row.reviewed_at,
              user: {
                id: row.user_id,
                name: row.name,
                icon_url: row.icon_url }
            };
          }));
        });
  });
};
