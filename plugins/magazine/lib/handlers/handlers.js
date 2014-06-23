
module.exports = function(app) {
  return {
    start: require('./start-page.js')(app),
    startMore: require('./start-more-page.js')(app),

    cls: require('./cls-page.js')(app),
    tag: require('./tag-page.js')(app),
    article: require('./article-page.js')(app),
    page: require('./generic-page.js')(app),

    mainRss: require('./main-rss.js')(app),
    clsRss: require('./cls-rss.js')(app)
  };
};
