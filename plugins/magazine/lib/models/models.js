
module.exports = function(resources) {
  return {
    articles: require('./articles.js')(resources),
    pages: require('./pages.js')(resources),
    classifications: require('./classifications.js')(resources),
    stages: require('./stages.js')(resources),
    teasers: require('./teasers.js')(resources),
    contributors: require('./contributors.js')(resources)
  };
};