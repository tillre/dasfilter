var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');


var paths = {
  less: './plugins/admin/less/**/*.less',
  mainLess: './plugins/admin/less/main.less',
  vendorCss: ['./plugins/admin/bower_components/bootstrap/dist/css/bootstrap.css',
        './plugins/admin/bower_components/cores-ng/css/cores.css',
              './plugins/admin/bower_components/eonasdan-datetimepicker/build/css/bootstrap-datetimepicker.min.css'],
  fonts: './plugins/admin/bower_components/bootstrap/fonts/*.*',
  scripts: ['./plugins/admin/bower_components/jquery/dist/jquery.js',
            './plugins/admin/bower_components/angular/angular.js',
            './plugins/admin/bower_components/angular-route/angular-route.js',
            './plugins/admin/bower_components/bootstrap/dist/js/bootstrap.js',
            './plugins/admin/bower_components/moment/moment.js',
            './plugins/admin/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
            './plugins/admin/bower_components/markdown/lib/markdown.js',
            './plugins/admin/bower_components/cores-ng/cores.js',
            './plugins/admin/scripts/*.js'],
  images: './plugins/admin/images/*.*'
};


gulp.task('vendor-css', function() {
  return gulp.src(paths.vendorCss)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./static/assets/css/'));
});


gulp.task('fonts', function() {
  return gulp.src(paths.fonts).pipe(gulp.dest('./static/assets/fonts/'));
});


gulp.task('less', function() {
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


gulp.task('build', ['less', 'vendor-css', 'scripts', 'fonts', 'images'], function() {});


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
    watch: ['*.js', 'plugins/admin/index.js', 'plugins/admin/lib/**/*.js'],
    env: {
      'NODE_ENV': 'development'
    }
  });
});


gulp.task('update-plugin-packages', shell.task([
  'npm update',
  'bower update'
], { cwd: './plugins/admin' }));
