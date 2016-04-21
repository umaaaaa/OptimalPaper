var express = require('express');
var router = express.Router();

var papers = require('../models/papers');

router.get('/', function(req, res, next) {
  var keyword = req.query.keyword;
  var orderby = req.query.orderby;

  if(req.user) {
    //認証あり
    if(!(keyword &&
          (  orderby=='recent'
          || orderby=='optimal'
          || orderby=='rating'))) return res.redirect('/');

    papers.searchWithUser(keyword, orderby, req.user)
      .then(function(ps) {
        res.render('search',
            {keyword: keyword, orderby: orderby, papers: ps, user: req.user});
      })
      .catch(next);
  }
  else {
    //認証なし
    if(!(keyword &&
          (orderby=='recent'
          || orderby=='rating'))) return res.redirect('/');

    papers.search(keyword, orderby)
      .then(function(ps) {
        res.render('search',
            {keyword: keyword, orderby: orderby, papers: ps});
      })
      .catch(next);
  }
});

module.exports = router;
