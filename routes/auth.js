var express = require('express');
var router = express.Router();

var passport = require('../models/passport');

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter',
    { successRedirect: '/',
      failureRedirect: '/login' }));

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
