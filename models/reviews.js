"use strict";

var db = require('./db');

var reviews = {};

reviews.getByPaper = function (paper_id) {
  return new Promise(function(resolve, reject) {
    db.query(
      'select review.id,user_id,paper_id,rate,comment,reviewed_at,name,icon_url ' +
      'from review join user on user.id=user_id where paper_id=?',
      [paper_id],
      function(err, rows) {
        if (err) return reject(err);

        resolve(rows.map(function(row){
          return {
            id: row.id,
            paper_id: row.paper_id,
            rate: row.rate,
            comment: row.rate,
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

reviews.getByUserId = function (id) {
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
              comment: row.rate,
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

module.exports = reviews;
