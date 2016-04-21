"use strict";

var db = require('./db');

var reviews = {};

reviews.getByPaperId = function (paper_id) {
  return new Promise(function(resolve, reject) {
    db.query(
      'select id,user_id,paper_id,rate,comment,reviewed_at,name,icon_url' +
      'from review join user on user.id=user_id where paper_id=?',
      [paper_id],
      function(err, rows) {
        if (err) return reject(err);
        return rows.map(function(row){
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
        });
      });
};

reviews.getByUserId = function (id) {
}

reviews.getRecentByPaperId = function (id) {
};

module.exports = reviews;
