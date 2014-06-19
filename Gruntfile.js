var Path = require('path');


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // less css

    less: {
      admin: {
        files: {
          './static/assets/css/styles.css': './plugins/admin/less/styles.less'
        }
      }
    },

    // copy js/css files to assets folder

    copy: {
      build: {
        files: [
          // admin
          {
            expand: true,
            cwd: './plugins/admin/public',
            src: '**',
            dest: './static/assets'
          },
          {
            expand: true,
            cwd: './plugins/admin/bower_components',
            src: '**',
            dest: './static/assets/vendor'
          }
        ]
      }
    },

    // delete build folder

    clean: {
      build: ['./static/assets']
    },

    // watch assets and build on changes

    watch: {
      assets: {
        files: ['./plugins/**/*.js',
                './plugins/**/public/**/*.*',
                './plugins/**/*.less'],
        tasks: ['build', 'serve'],
        options: {
          interrupt: true
        }
      }
    },

    // packages

    npm: {
      admin: './plugins/admin'
    },

    bower: {
      admin: './plugins/admin'
    }
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');


  // create build
  grunt.registerTask('build', ['clean', 'less', 'copy']);

  // install and build
  grunt.registerTask('install', ['npm', 'bower', 'build']);

  grunt.registerTask('serve', 'start server', function() {
    var done = this.async();
    require('./index.js');
    // never call done, interrupt manually
  });

  grunt.registerMultiTask('npm', 'update packages', function() {
    var done = this.async();
    var cwd = Path.resolve(this.data);

    runCmd('npm', ['update'], cwd, done);
  });

  grunt.registerMultiTask('bower', 'install components', function() {
    var done = this.async();
    var cwd = Path.resolve(this.data);

    runCmd(Path.join(__dirname, './node_modules/bower/bin/bower'), ['update'], cwd, done);
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
