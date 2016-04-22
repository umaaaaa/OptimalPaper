"use strict";

var db = require('./db');
var papers = require('./papers');

var recommends = {};

//おすすめ度
recommends.factor = function (repo, id_repo, orderby, user) {
  return Promise.resolve(Math.random()*5);
  
}

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
