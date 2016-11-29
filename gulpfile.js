var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');

var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');
var prefix = require('gulp-autoprefixer');
var AWS = require('aws-sdk')

var env = process.env

// ----------------------------------------------------------------------
// Admin Tasks
// ----------------------------------------------------------------------

var adminPaths = {
  less: './plugins/admin/less/**/*.less',
  mainLess: './plugins/admin/less/main.less',
  vendorCss: ['./bower_components/bootstrap/dist/css/bootstrap.css',
              './bower_components/cores-ng/css/cores.css',
              './bower_components/eonasdan-datetimepicker/build/css/bootstrap-datetimepicker.min.css'],
  fonts: './bower_components/bootstrap/fonts/*.*',
  scripts: ['./bower_components/jquery/dist/jquery.js',
            './bower_components/angular/angular.js',
            './bower_components/angular-route/angular-route.js',
            './bower_components/bootstrap/dist/js/bootstrap.js',
            './bower_components/moment/moment.js',
            './bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
            './bower_components/markdown/lib/markdown.js',
            './bower_components/cores-ng/cores.js',
            './plugins/admin/scripts/*.js'],
  images: './plugins/admin/images/*.*',
  output: './static/admin'
};


gulp.task('admin-vendor-css', function() {
  return gulp
    .src(adminPaths.vendorCss)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(adminPaths.output + '/css'));
});


gulp.task('admin-fonts', function() {
  return gulp
    .src(adminPaths.fonts)
    .pipe(gulp.dest(adminPaths.output + '/fonts'));
});


gulp.task('admin-less', function() {
  return gulp
    .src(adminPaths.mainLess)
    .pipe(less())
    .pipe(gulp.dest(adminPaths.output + '/css'));
});


gulp.task('admin-scripts', function() {
  return gulp
    .src(adminPaths.scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(adminPaths.output + '/scripts'));
});


gulp.task('admin-images', function() {
  return gulp
    .src(adminPaths.images)
    .pipe(gulp.dest(adminPaths.output + '/images'));
});


gulp.task('admin-build', [
  'admin-less',
  'admin-vendor-css',
  'admin-scripts',
  'admin-fonts',
  'admin-images'
], function() {});


// ----------------------------------------------------------------------
// Magazine Tasks
// ----------------------------------------------------------------------

var magazinePaths = {
  icons: './plugins/magazine/design/icons/*.svg',
  less: './plugins/magazine/less/**/*.less',
  mainLess: './plugins/magazine/less/main.less',
  scripts: ['./bower_components/jquery/dist/jquery.js',
            './plugins/magazine/scripts/*.js'],
  images: './plugins/magazine/images/*.*',
  output: './static/magazine'
};


gulp.task('magazine-svg2less', function() {
  function svg2css(cssPrefix) {
    return through.obj(function(file, enc, cb) {
      if (file.isNull()) {
        return cb(new gutil.PluginError('svg2less',
                                        'File not found: ' + file.path));
      }
      if (file.isStream()) {
        return cb(new gutil.PluginError('svg2less',
                                        'Streaming not supported'));
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
  return gulp.src(magazinePaths.icons)
    .pipe(svg2css('.svg-'))
    .pipe(concat('svg.generated.less'))
    .pipe(gulp.dest('./plugins/magazine/less'));
});


gulp.task('magazine-styles', ['magazine-svg2less'], function() {
  return gulp.src(magazinePaths.mainLess)
    .pipe(less())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 9'))
    .pipe(gulp.dest(magazinePaths.output + '/css'));
});


gulp.task('magazine-scripts', function() {
  return gulp.src(magazinePaths.scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(magazinePaths.output + '/scripts'));
});


gulp.task('magazine-images', function() {
  return gulp.src(magazinePaths.images)
    .pipe(gulp.dest(magazinePaths.output + '/images'));
});


gulp.task('magazine-build', [
  'magazine-styles',
  'magazine-scripts',
  'magazine-images'
], function() {});


// ----------------------------------------------------------------------
// Common Tasks
// ----------------------------------------------------------------------

gulp.task('setup-s3-dev', function(done) {
  if (!env.DF_S3_ENDPOINT) {
    console.log('Warning: s3 endpoint is undefined')
    return done()
  }
  var s3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: env.DF_S3_KEY,
    secretAccessKey: env.DF_S3_SECRET,
    endpoint: new AWS.Endpoint(env.DF_S3_ENDPOINT)
  })
  s3.createBucket({
    Bucket: env.DF_S3_BUCKET,
    ACL: 'public-read',
    CreateBucketConfiguration: {
      LocationConstraint: env.DF_S3_REGION
    }
  }, done)
})

gulp.task('build', [
  'admin-build',
  'magazine-build',
])

gulp.task('watch', function() {
  gulp.watch(adminPaths.icons, ['admin-styles']);
  gulp.watch(adminPaths.less, ['admin-styles']);
  gulp.watch(adminPaths.scripts, ['admin-scripts']);
  gulp.watch(adminPaths.images, ['admin-images']);

  gulp.watch(magazinePaths.icons, ['magazine-styles']);
  gulp.watch(magazinePaths.less, ['magazine-styles']);
  gulp.watch(magazinePaths.scripts, ['magazine-scripts']);
  gulp.watch(magazinePaths.images, ['magazine-images']);
});

gulp.task('serve-dev', [
  'setup-s3-dev',
  'build',
  'watch'
], function () {
  nodemon({
    script: 'index.js',
    ext: 'js',
    watch: [
      'manifest.js',
      'plugins/admin/index.js',
      'plugins/admin/lib/**/*.js',
      'plugins/magazine/index.js',
      'plugins/magazine/lib/**/*.js',
      'plugins/api/index.js',
      'plugins/api/lib/**/*.js'
    ],
    env: {
      'NODE_ENV': 'development'
    }
  });
});
