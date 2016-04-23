var express = require('express');
var router = express.Router();

var passport = require('../models/passport');

//Auth by Twitter routing
router.get('/twitter',
  function(req, res, next) {
    if (!req.session.after_login) req.session.after_login = req.header('Referer');
    next();
  },
  passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter',
    { successRedirect: '/auth/success',
      failureRedirect: '/' }));

//認証成功時に元いたページに戻る
router.get('/success', function(req, res, next) {
  var after_login = req.session.after_login;
  if (!after_login) return res.redirect('/');
  req.session.after_login = undefined;
  res.redirect(after_login);
});

//Logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
