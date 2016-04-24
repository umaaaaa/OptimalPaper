"use strict";

var db = require('./db');

var users = {};

users.getById = function (id) {
  return new Promise(function(resolve, reject) {
    db.query('select * from user where id = ?',
      [id],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length == 1) return resolve(rows[0]);
        reject(new Error('Count of selected user is not 1'));
      })
    })
    .then(function(user){
      var reg = user.registered_at;
      var reg_at = reg.getFullYear() + '年' + (reg.getMonth()+1) + '月' + reg.getDate() + '日';
      user.registered_at = reg_at;
      return user;
    });
};

users.getCountOfReviews = function(id) {
  return db.queryPromise(
      'select count(*) as count from review where user_id = ?',
      [id])
    .then(function(rows) {
      if (rows.length != 1) throw new Error('count err');
      return rows[0].count;
    });
};

users.getCountOfReviewsRecentDay = function(id, days) {
  var limit = new Date();
  limit.setDate(limit.getDate() - days);
  return db.queryPromise(
      'select count(*) as count from review '+
      'where user_id=? and reviewed_at>?',
      [id, limit])
    .then(function(rows) {
      if (rows.length != 1) throw new Error('count err');
      return rows[0].count;
    });
};

//キニナル木の段階数への変換
function grade(count) {
  return Math.min(Math.floor((count+1) / 2 ), 5);
}

users.getByIdMore = function (id) {
  return users.getById(id)
    .then(function(user) {
      return users.getCountOfReviews(id)
        .then(function(count) {
          return users.getCountOfReviewsRecentDay(id,100)
            .then(function(recent_count) {
              user.all_reviews = count;
              user.day100_reviews = recent_count;
              user.grade = grade(recent_count);
              return user;
            });
        });
    });
};

users.getByAuthId = function (auth, id_auth) {
  return new Promise(function(resolve, reject) {
    db.query('select * from user where auth = ? and id_auth = ?',
      [auth, id_auth],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length == 1) return resolve(rows[0]);
        reject(new Error('Count of selected user is not 1'));
      });
    });
};

users.updateOrInsert = function (auth, id_auth, name, icon_url) {
  return new Promise(function(resolve, reject) {
    db.query('select * from user where auth = ? and id_auth = ?',
      [auth, id_auth],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length >= 1) {
          let user = rows[0];
          //userの名前とアイコンURLを更新
          db.query('update user set ? where id = ?',
            [{name:name, icon_url:icon_url}, user.id],
            function (err, res) {
              if (err) return reject(err);
              resolve({
                id: user.id,
                auth: user.auth,
                id_auth: user.id_auth,
                name: name,
                icon_url: icon_url,
                registered_at: user.registered_at});
            });
        }
        else {
          //userを追加
          var now = new Date();
          db.query('insert into user set ?',
            {
              auth: auth,
              id_auth: id_auth,
              name: name,
              icon_url: icon_url,
              registered_at: now
            },
            function (err, res) {
              if (err) return reject(err);
              resolve({
                id: res.insertId,
                auth: auth,
                id_auth: id_auth,
                name: name,
                icon_url: icon_url,
                registered_at: now
              });
            });
        }
      });
    });
};

module.exports = users;
