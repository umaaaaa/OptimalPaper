var express = require('express');
var router = express.Router();

var papers = require('../models/papers');

router.get('/naid/:id', function(req, res, next) {
  var naid = req.params.id;
  var cinii = 1;

  papers.fetchDetailWithRecommend(cinii, naid, req.user)
    .then(function(detail){
      detail.json2str = JSON.stringify; //for develop
      detail.user = req.user;
      res.render('paper', detail);
    })
    .catch(next);
});

module.exports = router;
