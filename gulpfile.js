var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');

var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');


function svg2css(cssPrefix) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(new gutil.PluginError('svg2less', 'File not found: ' + file.path));
    }
    if (file.isStream()) {
      return cb(new gutil.PluginError('svg2less', 'Streaming not supported'));
    }

    var svg = file.contents.toString('utf8');
	  var prefix = "data:image/svg+xml;charset=US-ASCII,";

		var value = prefix + encodeURIComponent(
      svg.toString('utf-8')
			  //strip newlines and tabs
			  .replace( /[\n\r]/gmi, "" )
			  .replace( /\t/gmi, " " )
			  //strip comments
			  .replace(/<\!\-\-(.*(?=\-\->))\-\->/gmi, "")
			  //replace
			  .replace(/'/gmi, "\\i")
    );
    var css = cssPrefix + path.basename(file.path, '.svg') + ' {\n' +
          '    background-image: url("' + value + '");\n' +
          '    background-repeat: no-repeat;\n' +
          '}\n';

    file.path = gutil.replaceExtension(file.path, '.css');
    file.contents = new Buffer(css);
    this.push(file);

    cb();
  });
}


var paths = {
  icons: './plugins/magazine/design/icons/*.svg',
  less: './plugins/magazine/less/**/*.less',
  mainLess: './plugins/magazine/less/main.less',
  scripts: ['./plugins/magazine/bower_components/jquery/dist/jquery.js',
                  './plugins/magazine/scripts/*.js'],
  images: './plugins/magazine/images/*.*'
};


gulp.task('svg2less', function() {
  return gulp.src(paths.icons)
    .pipe(svg2css('.svg-'))
    .pipe(concat('svg.generated.less'))
    .pipe(gulp.dest('./plugins/magazine/less'));
});


gulp.task('styles', ['svg2less'], function() {
  return gulp.src(paths.mainLess)
    .pipe(less())
    .pipe(gulp.dest('./static/assets/css/'));
});


gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./static/assets/scripts'));
});


gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('./static/assets/images'));
});


gulp.task('build', ['styles', 'scripts', 'images'], function() {
});


gulp.task('watch', function() {
  gulp.watch(paths.icons, ['styles']);
  gulp.watch(paths.less, ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});


gulp.task('serve', ['build', 'watch'], function () {
  nodemon({
    script: 'index.js',
    ext: 'js',
    watch: ['*.js', 'plugins/magazine/index.js', 'plugins/magazine/lib/**/*.js'],
    env: {
      'NODE_ENV': 'development'
    }
  });
});


gulp.task('update-plugin-packages', shell.task([
  'npm update',
  'bower update'
], { cwd: './plugins/magazine' }));
