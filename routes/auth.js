var express = require('express');
var router = express.Router();

var passport = require('../models/passport');

//Auth by Twitter routing
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter',
    { successRedirect: '/',
      failureRedirect: '/login' }));

//Logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
