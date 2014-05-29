var Path = require('path');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // less css

    less: {
      admin: {
        files: {
          './static/assets/css/styles.css': './plugins/magazine/less/styles.less'
        }
      }
    },

    // inline svgs in css

    svg2less: {
      icons: {
        src: './plugins/magazine/design/icons',
        dest: './plugins/magazine/less/svg.generated.less',
        prefix: '.svg-'
      }
    },

    // copy js/css files to assets folder

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: './plugins/magazine/public',
            src: '**',
            dest: './static/assets'
          },
          {
            expand: true,
            cwd: './plugins/magazine/bower_components',
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
        files: ['./plugins/**/public/**/*.*',
                './plugins/**/*.less',
                './plugins/magazine/design/icons/**/*.svg'],
        tasks: ['build']
      }
    },

    // packages

    npm: {
      admin: './plugins/magazine'
    },

    bower: {
      admin: './plugins/magazine'
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


  grunt.registerMultiTask('npm', 'install packages', function() {
    var done = this.async();
    var cwd = Path.resolve(this.data);

    runCmd('npm', ['install'], cwd, done);
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
