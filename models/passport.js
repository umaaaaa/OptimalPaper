var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;

var users = require('./users');

//認証サイトID
var auth = { twitter: 1 };

//user <-> sesion
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  users.getById(id)
    .then(function(user) {
      done(null, user);
    })
    .catch(function(err) {
      done(err);
    });
});

//auth by twitter
passport.use(new TwitterStrategy({
  consumerKey: process.env.OP_TW_API_KEY
    || 'RkGetuB6yf7FS0tAI0dNbyTSL',
  consumerSecret: process.env.OP_TW_API_SECRET
    || 'ecm4NAnVyCJ2EkjjW1tq0AEw8O05QONMwN1U20IvD2PnwnRE0o',
  callbackURL: "/auth/twitter/callback"
},
function(token, tokenSecret, profile, done) {
  users
    .updateOrInsert(
        auth.twitter,
        profile.id,
        profile.displayName,
        profile.photos[0].value.replace('_normal',''))
    .then(function(user) {
      done(null, user);
    })
    .catch(function(err) {
      done(err);
    });
}));

module.exports = passport;
