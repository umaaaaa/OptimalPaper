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
