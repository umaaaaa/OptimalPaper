var express = require('express');
var router = express.Router();

var papers = require('../models/papers');
/* GET users listing. */
/* とりあえずindexのときと同じ形にした */
router.get('/:id', function(req, res, next) {
  if(req.user) {
    //認証あり
    papers.getOptimal(4, req.user)
      .then(function(ps) {
        res.render('user', {id: req.params.id, type: 'optimal', papers: ps, user: req.user});
      })
      .catch(next);
  }
  else {
    //認証なし
    papers.getRecent(4)
      .then(function(ps) {
        res.render('user', {id: req.params.id, type: 'recent', papers: ps});
      })
      .catch(next);
  }
});

module.exports = router;
