"use strict";

var db = require('./db');
var papers = require('./papers');
var reviews = require('./reviews');

var recommends = {};

function rating(paper_id) {
  return reviews.getAvgRateByPaper(paper_id);
}

function recent(paper_id) {
  return Promise.reject(new Error('実装されてない'));
}

function optimal(paper_id, user) {
  return Promise.reject(new Error('実装されてない'));
}

//おすすめ度
recommends.factor = function (paper_id, orderby, user) {
  if (!paper_id) return Promise.resolve(0);
  if (orderby == 'rating') return rating(paper_id);
  if (orderby == 'recent') return recent(paper_id);
  if (orderby == 'optimal') return optimal(paper_id, user);
  return Promise.reject(new Error());
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
