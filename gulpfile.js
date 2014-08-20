var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');

gulp.task('update-plugin-packages', shell.task([
  'npm update',
], { cwd: './plugins/api' }));


// pseudo build task for compatibility
gulp.task('build', function() {});


gulp.task('serve', function () {
  nodemon({
    script: 'index.js',
    ext: 'js',
    watch: ['plugins/api/index.js', 'plugins/api/lib/**/*.js'],
    env: {
      'NODE_ENV': 'development'
    }
  });
});
