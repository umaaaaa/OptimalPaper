"use strict";

var db = require('./db');

var recommends = {};

recommends.getByPaper = function (paper_id, max, user) {
  return Promise.resolve([
      {
        title:"hoge"
      },
      {
        title:"fuga"
      }
  ]);
};

module.exports = recommends;
