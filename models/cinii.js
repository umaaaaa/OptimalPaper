"use strict";
var agent = require('superagent-bluebird-promise');
var db = require('./db');

var cinii = {};

//cinii
var repo = 1;

cinii.fetchDetailByNaid = function (naid) {
  return agent
      .get('http://ci.nii.ac.jp/naid/' + naid + '.json')
      .then(function (response) {
        var paper = response.body['@graph'][0];
        return {
          title: paper['dc:title']
            && paper['dc:title'][0]['@value'],
          creators: paper['dc:creator']
            && paper['dc:creator'].map(function(n){return n[0]['@value'];}),
          publish_info: {
            publisher: paper['dc:publisher']
              && paper['dc:publisher'][0]['@value'],
            publicationName: paper['prism:publicationName']
              && paper['prism:publicationName'][0]['@value'],
            issn: paper['prism:issn'],
            volume: paper['prism:volume'],
            number: paper['prism:number'],
            page: {start: paper['prism:startingPage'], end: paper['prism:endingPage']},
            date: paper['prism:publicationDate'] },
          topics:
            paper['foaf:topic'] && paper['foaf:topic']
              .map(function (topic){return topic['dc:title'][0]['@value'];}),
          references: paper['cinii:references'],
          citedBy: paper['cinii:citedBy'],
          description: paper['dc:description']
            && paper['dc:description'][0]['@value'],
          id_repo: naid,
          repo: repo
        };
      });
};

//TODO
cinii.searchOrderByCited = function (keyword, opt_max) {
  var max = opt_max || 1000;
  var max_per_req = 200;
  var endpoint = 'http://ci.nii.ac.jp/opensearch/search';
  var citedBy = 7;

  return agent
    .get(endpoint)
    .query({
      format: 'json',
      q: keyword,
      sortorder: citedBy,
      count: Math.min(max_per_req, max)
    })
    .then(function (response) {
      var first_res = response.body['@graph'][0];
      var total = first_res['opensearch:totalResults'];

      if (max<=max_per_req || total<=max_per_req)
        return first_res.items;

      var starts = [];
      for (let start=max_per_req; start<Math.min(max, total); sart+=max_per_req)
        starts.push(start);

      //残りの結果をmaxまで取得
      return Promise
        .all(starts.map(function(start) {
          return agent
            .get(endpoint)
            .query({
              format: 'json',
              q: keyword,
              sortorder: citedBy,
              count: max_per_req,
              start: start
            })
            .then(function(response) {
              var partial_res = response.body['@graph'][0];
              return {partial_res:partial_res, start:start};
            });
          }))
        .then(function(results) {
          //最初に取得した結果とそれ以降の結果を一つの配列にする
          return Array.prototype.concat.apply(first_res.items,
            results
              .sort(function(a,b){return a.start-b.start;})
              .map(function(result){return result.partial_res.items;}));
        });
    })
    .then(function(papers){
      if (!papers) return [];
      return papers.map(function(paper){
        return {
          title: paper['title'],
          creators: paper['dc:creator']
            && paper['dc:creator'].map(function(n){return n['@value'];}),
          publish_info: {
            publisher: paper['dc:publisher'],
            publicationName: paper['prism:publicationName'],
            issn: paper['prism:issn'],
            volume: paper['prism:volume'],
            number: paper['prism:number'],
            page: {start: paper['prism:startingPage'], end: paper['prism:endingPage']},
            date: paper['prism:publicationDate'] },
          description: paper['description'],
          id_repo: Number(paper['@id'].split('/').pop()),
          repo: repo
        };
      });
    });
};

module.exports = cinii;
