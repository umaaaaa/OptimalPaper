var express = require('express');
var router = express.Router();

var reviews = require('../models/reviews');

router.post('/', function(req, res, next) {
  if (!req.user) return res.redirect('/');

  var b = req.body;
  console.log([b.repo,b.id_repo, b.rate, b.comment, req.user]);
  reviews.insert(b.repo, b.id_repo, b.rate, b.comment, req.user)
    .then(function(id){
      if (b.repo == 1) return res.redirect('/paper/naid/' + b.id_repo);
      throw new Error('Unknown repository')
    })
    .catch(next);
});

module.exports = router;
