var Helpers = require('./helpers.js');


module.exports = function(coresHapi) {

  function addStamp(doc, request) {
    var username = request.headers['df-user'].split(':')[0];
    var st = {
      date: new Date().toISOString(),
      user: username
    };

    if (!doc.stamp_) {
      doc.stamp_ = { created: st, modified: st };
    }
    else {
      doc.stamp_.modified = st;
    }
    return doc;
  }

  coresHapi.pre.create(addStamp);
  coresHapi.pre.update(addStamp);
};
