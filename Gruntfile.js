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
      all: {
        files: ['./plugins/**/*.js',
                './plugins/**/public/**/*.*',
                './plugins/**/*.less',
                '!./plugins/**/svg.generated.less',
                './plugins/magazine/design/icons/**/*.svg'],
        tasks: ['build', 'serve'],
        options: {
          interrupt: true
        }
      }
    },

    // packages

    npm: {
      web: './plugins/magazine'
    },

    bower: {
      web: './plugins/magazine'
    }
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');


  // create build
  grunt.registerTask('build', ['clean', 'svg2less', 'less', 'copy']);


  // install and build
  grunt.registerTask('install', ['npm', 'bower', 'build']);

  grunt.registerTask('serve', 'start server', function() {
    var done = this.async();
    require('./index.js');
    // never call done, interrupt manually
  });

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

  grunt.registerMultiTask('svg2less', 'create css file with inline svgs', function() {
    var DirectoryEncoder = require('directory-encoder');
    var de = new DirectoryEncoder(
      Path.resolve(__dirname, this.data.src),
      Path.resolve(__dirname, this.data.dest),
      { prefix: this.data.prefix || '.svg-' });
    de.encode();
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
