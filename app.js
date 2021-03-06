var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var db = require('./models/db');
var passport = require('./models/passport');

var routes = require('./routes/index');
var user = require('./routes/user');
var auth = require('./routes/auth');
var search = require('./routes/search');
var paper = require('./routes/paper');
var review = require('./routes/review');

var app = express();

//view engine setup
var ectRenderer = require('ect')({ watch: true, root: path.join(__dirname, 'views'), ext : '.ect' });
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.OP_SESSION_SECRET || 'optimalpaper',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/user', user);
app.use('/auth', auth);
app.use('/search', search);
app.use('/paper', paper);
app.use('/review', review);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
