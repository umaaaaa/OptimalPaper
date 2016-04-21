var express = require('express');
var router = express.Router();

var papers = require('../models/papers');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    //認証あり
    papers.getOptimal(4, req.user)
      .then(function(ps) {
        res.render('index', {type: 'optimal', papers: ps, user: req.user});
      })
      .catch(next);
  }
  else {
    //認証なし
    papers.getRecent(4)
      .then(function(ps) {
        res.render('index', {type: 'recent', papers: ps});
      })
      .catch(next);
  }
});

module.exports = router;
