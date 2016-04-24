"use strict";

var papers = module.exports = {};

var db = require('./db');
var cinii = require('./cinii');
var reviews = require('./reviews');
var recommends = require('./recommends');

var repos = { cinii: 1 }

papers.getOrSet = function (repo, id_repo) {
  return papers.getPaperId(repo, id_repo)
    .then(function(paper_id) {
      if (paper_id) return paper_id;

      return new Promise(function(resolve, reject) {
        db.query('insert into paper set ?',
          { repo:repo, id_repo:id_repo },
          function(err, res) {
            if (err) return reject(err);
            resolve(res.insertId);
          });
      });
    });
};

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

papers.getIdRepo = function (paper_id) {
  return new Promise(function(resolve, reject) {
    db.query('select repo,id_repo from paper where id=?',
      [paper_id],
      function(err, rows) {
        if (err) return reject(err);
        if (rows.length == 0) return reject(new Error('Not exist'));
        resolve(rows[0]);
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
      detail.optimal = recommends.factor(repo, id_repo, 'optimal', user);
      return detail;
    })
    .then(function(detail) {
      if (!detail.paper_id) return { detail:detail };

      return reviews.getByPaper(detail.paper_id)
        .then(function(revs) {
          return reviews.getAvgRateByPaper(detail.paper_id)
            .then(function(rate) {
              var myrev;
              if (user) {
                myrev = revs.find(function(rev) {
                  return rev.user.id == user.id;
                });
                revs = revs.filter(function(rev) {
                  return rev.user.id != user.id;
                });
              };

              return {
                detail: detail,
                rate: rate,
                reviews: revs,
                my_review: myrev
              };
            });
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

papers.attachToOveriew = function(ov) {
  return papers.getIdRepo(ov.paper_id)
      .then(function(paper_repo){
        return {
          ov: ov,
          paper_repo: paper_repo
        };
      })
      .then(function(res){
        return papers
          .fetchDetail(res.paper_repo.repo, res.paper_repo.id_repo)
          .then(function(detail){
            res.ov.paper = detail;
            return res.ov;
          });
      });
};

papers.attachToOverviews = function(ovs) {
    return Promise.all(ovs.map(papers.attachToOveriew));
};

papers.getByUser = function (user) {
  //cinii APIを呼ぶので制限
  //TODO:ほんとはちゃんとDBかキャッシュに持つ
  var limited_count = 30;

  return reviews.getByUser(user)
    .then(reviews.getOverviews)
    .then(function(revs) {
      return revs.length > limited_count ? revs.slice(0, limited_count) : revs})
    .then(papers.attachToOverviews);
};

papers.getRecent = function (count) {
  //count回cinii APIを呼ぶので制限
  //TODO:ほんとはちゃんとDBかキャッシュに持つ
  var limited_count = Math.max(count, 10);

  return reviews.getRecent(limited_count)
    .then(reviews.getOverviews)
    .then(papers.attachToOveriews);
};

papers.getOptimal = function(count, user) {
  return Promise.resolve([]);
};


papers.search = function(keyword, orderby, user) {
  return cinii.searchOrderByCited(keyword, 200)
    .then(function(ps){
      var overviews = ps.map(function(paper) {
        return papers.getPaperId(paper.repo, paper.id_repo)
          .then(function(paper_id){
            return { paper: paper, paper_id: paper_id };
          })
          .then(reviews.attachToOverview);
      });
      return Promise.all(overviews);
    })
    .then(function(overviews){
      var factored_overviews = overviews.map(function(ov, index) {
        return recommends.factor(ov.paper_id, orderby, user)
          .then(function(factor) {
            ov.index = index;
            ov.factor = factor;
            return ov;
          });
      });
      return Promise.all(factored_overviews);
    })
    .then(function (factored_overviews) {
      return factored_overviews.sort(function(a,b) {
        return (b.factor - a.factor) || (a.index - b.index);
      });
    });
};
