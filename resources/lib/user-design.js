module.exports = {

  views: {
    usernames: {
      map: function(doc) {
        if (doc.type_ === 'User') {
          emit(doc.username, null);
        }
      }
    }
  }
};