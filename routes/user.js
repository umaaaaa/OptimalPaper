var express = require('express');
var router = express.Router();

var papers = require('../models/papers');
var users = require('../models/users');

/* とりあえずindexのときと同じ形にした */
router.get('/:id', function(req, res, next) {
  users.getById(req.params.id)
    .then(function(us) {
      res.render('user', {type: 'optimal', users: us, papers: papers, user:req.user});
    })
    .catch(next);
});

module.exports = router;
