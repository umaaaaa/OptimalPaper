var express = require('express');
var router = express.Router();

var papers = require('../models/papers');
var users = require('../models/users');

/* とりあえずindexのときと同じ形にした */
router.get('/:id', function(req, res, next) {
  users.getById(req.params.id)
    .then(function(us) {
      console.log("認証ずみ！！！！");
      res.render('user', {type: 'optimal', users: us});
    })
    .catch(next);
});

module.exports = router;
