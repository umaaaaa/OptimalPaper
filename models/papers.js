"use strict";

var db = require('./db');
var cinii = require('./cinii');
var reviews = require('./reviews');
var recommends = require('./recommends');

var papers = {};

var repos = { cinii: 1 }

papers.getPaperId = function (repo, id_repo) {
  return new Promise(function(resolve, reject) {
    db.query('select id from paper where repo=? and id_repo=?',
      [repo, id_repo],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length != 1) return resolve(null);
        resolve(rows[0].id);
      });
  });
};

papers.fetchDetail = function (repo, id_repo) {
  return (repo==repos.cinii ? cinii.fetchDetailByNaid(id_repo):
       Promise.reject(new Error("Unknown repository")))
    .then(function(detail) {
      return papers.getPaperId(repo, id_repo)
        .then(function(paper_id) {
          if(paper_id)
            detail.paper_id = paper_id;
          return detail;
        })
    });
};

papers.fetchDetailWithRecommend = function(repo, id_repo, user) {
  return papers
    .fetchDetail(repo, id_repo)
    .then(function(detail) {
      if (!detail.paper_id) return { detail:detail };

      return reviews.getByPaper(detail.paper_id)
        .then(function(revs) {
          console.log(revs);
          return {
            detail: detail,
            reviews: revs
          };
        });
    })
    .then(function(res) {
      if (!res.detail.paper_id) return res;

      return recommends.getByPaper(res.detail.paper_id, 4, user)
        .then(function (rcm) {
          res.recommends = rcm;
          return res;
        });
    });
};

papers.getRecent = function (count) {
  return new Promise(function(resolve, reject) {
    db.query(
        'select repo,id_repo,rate,comment,rr_at,user_id' +
        'from (select paper_id as p_id,max(reviewed_at) as rr_at' +
        '      from review group by paper_id order by rr_at desc limit ?)' +
        'join review on paper_id=p_id and reviewed_at=rr_at' +
        'join paper on id=paper_id' +
        'order by reviewed_at desc',
        [count],
        function(err, rows) {
          if (err) return reject(err);
          rows.map(function (row) {
            
          })
        });
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
