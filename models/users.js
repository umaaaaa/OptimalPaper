"use strict";

var db = require('./db');

var users = {};

users.getById = function (id) {
  return new Promise(function(resolve, reject) {
    db.query('select id,auth,id_auth,name from user where id = ?',
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
    db.query('select id,auth,id_auth,name from user where auth = ? and id_auth = ?',
      [auth, id_auth],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length == 1) return resolve(rows[0]);
        reject(new Error('Count of selected user is not 1'));
      });
    });
};

users.updateOrInsert = function (auth, id_auth, name) {
  return new Promise(function(resolve, reject) {
    db.query('select id,auth,id_auth,name from user where auth = ? and id_auth = ?',
      [auth, id_auth],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length >= 1) {
          let id = rows[0].id;
          db.query('update user set ? where id = ?',
            [{name:name}, id],
            function (err, res) {
              if (err) return reject(err);
              resolve({id:id, auth:auth, id_auth:id_auth, name:name});
            });
        }
        else {
          db.query('insert into user set ?',
            {auth:auth, id_auth:id_auth, name:name},
            function (err, res) {
              if (err) return reject(err);
              resolve({id:res.insertId, auth:auth, id_auth:id_auth, name:name});
            });
        }
      });
    });
};

module.exports = users;
