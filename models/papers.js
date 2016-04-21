"use strict";

var db = require('./db');

var papers = {};

papers.fetchDetailByNaid = function (naid) {
  
};

papers.getRecent = function (count) {
  return new Promise(function(resolve, reject) {
    resolve([{
      title: "タイトル",
      rate: 3,
      link: "/paper/nii/1111111111111",
      review: {
        rate: 4,
        comment: "こめんと",
        user: {
          id: 42,
          auth: 1,
          id_auth: 12345678,
          name: "名前",
        }
      }
    }]);
  });
};

papers.getOptimal = function (count, user) {
  return new Promise(function(resolve, reject) {
    resolve([{
      title: "タイトル",
      rate: 3,
      optimal_deg: 4,
      link: "/paper/nii/1111111111111",
      review: {
        rate: 4,
        comment: "こめんと",
        user: {
          id: 42,
          auth: 1,
          id_auth: 12345678,
          name: "名前",
        }
      }
    }]);
  });
};


papers.searchWithUser = function (keyword, orderby, user) {
  return new Promise(function(resolve, reject) {
    resolve([{
      title: "タイトル",
      rate: 3,
      link: "/paper/nii/1111111111111",
      review: {
        rate: 4,
        comment: "こめんと",
        user: {
          id: 42,
          auth: 1,
          id_auth: 12345678,
          name: "名前",
        }
      }
    }]);
  });
};

papers.search = function (keyword, orderby) {
  return new Promise(function(resolve, reject) {
    resolve([{
      title: "タイトル",
      rate: 3,
      optimal_deg: 4,
      link: "/paper/nii/1111111111111",
      review: {
        rate: 4,
        comment: "こめんと",
        user: {
          id: 42,
          auth: 1,
          id_auth: 12345678,
          name: "名前",
        }
      }
    }]);
  });
};

// TODO:速度考えるなら一つのSQLにすべき
function getRating(id) {
};

function getOptimalDeg(paper_id, user_id) {
};

module.exports = papers;
