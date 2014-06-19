var Path = require('path');


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // packages
    npm: {
      api: './plugins/api'
    }
  });


  // create build
  grunt.registerTask('build', []);


  // install and build
  grunt.registerTask('install', ['npm', 'build']);


  grunt.registerMultiTask('npm', 'update packages', function() {
    var done = this.async();
    var cwd = Path.resolve(this.data);
    runCmd('npm', ['update'], cwd, done);
  });


  // helpers
  function runCmd(cmd, args, cwd, done) {
    var child = grunt.util.spawn({
      cmd: cmd, args: args, opts: { cwd: cwd }
    }, function(err, result, code) {
      if (!err && code === 0) {
        grunt.log.ok(cmd, args, 'success');
      }
      done(err);
    });
    child.stdout.on('data', function(data) { grunt.log.write(data); });
    child.stderr.on('data', function(data) { grunt.log.write(data); });
  }
};
