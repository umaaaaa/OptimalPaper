var express = require('express');
var router = express.Router();

var papers = require('../models/papers');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    //認証あり
    papers.getOptimal(4, req.user)
      .then(function(ovs) {
        res.render('index', {type: 'optimal', overviews: ovs, user: req.user});
      })
      .catch(next);
  }
  else {
    //認証なし
    papers.getRecent(4)
      .then(function(ovs) {
        res.render('index', {type: 'recent', overviews: ovs});
      })
      .catch(next);
  }
});

module.exports = router;
