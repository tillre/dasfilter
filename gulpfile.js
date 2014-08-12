var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('update-plugin-packages', shell.task([
  'npm update',
], { cwd: './plugins/api' }));
