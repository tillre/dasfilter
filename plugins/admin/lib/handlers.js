var _ = require('lodash');


module.exports = function(app, viewContext) {

  return {

    loginGet: function(request, reply) {
      if (request.auth.isAuthenticated) {
        return reply('You are being redirected...').redirect(app.paths.admin);
      }
      return reply.view('login', viewContext(request));
    },


    loginPost: function(request, reply) {
      if (!request.payload.username || !request.payload.password) {
        return reply.view(
          'login',
          _.merge({ message: 'Missing username or password' }, viewContext(request))
        );
      }
      else {
        app.validateAccount(
          request,
          request.payload.username,
          request.payload.password

        ).then(function(user) {
          var credentials = {
            username: user.username,
            role: user.role
          };
          // request.auth.session.set(credentials);
          request.cookieAuth.set(credentials);
          reply('You are being redirected...').redirect(app.paths.admin);

        }).fail(function(err) {
          reply.view(
            'login',
            _.merge({ message: 'Invalid username or password' }, viewContext(request))
          );
        });
      }
    },


    logout: function(request, reply) {
      request.cookieAuth.clear();
      return reply('You are being redirected...').redirect(app.paths.login);
    },


    index: function(request, reply) {
      var context = _.merge({ credentials: request.auth.credentials }, viewContext(request));
      reply.view('index', context);
    },


    template: function(request, reply) {
      var context = _.merge({ credentials: request.auth.credentials }, viewContext(request));
      reply.view('templates/' + request.params.name, context);
    }
  };
};
