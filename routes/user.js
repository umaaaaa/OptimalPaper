var express = require('express');
var router = express.Router();

var papers = require('../models/papers');
var users = require('../models/users');

router.get('/:id', function(req, res, next) {
  users.getByIdMore(req.params.id)
    .then(function(user) {
      return papers.getByUser(user)
        .then(function(ovs){
          return {
            user: user,
            overviews: ovs
          };
        });
    })
    .then(function(info){
      res.render('user', {
        user: req.user, //認証された方のユーザー
        info: info, //表示するユーザーページの情報
      });
    })
    .catch(next);
});

module.exports = router;
