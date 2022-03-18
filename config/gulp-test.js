const gulp = require('gulp')

console.log(gulp, 'gulp')

// const { series } = gulp

// function clean(cb) {
//   console.log('clean')
//   cb();
// }

// function build(cb) {
//   console.log('build')
//   cb();
// }

gulp.task('compile-with-es', done => {
  // console.log('[Parallel] Compile to es...');
  // compile(false).on('finish', done);
  console.log('compile-with-es')
  done()
});

gulp.task('one', function(cb) {
  console.log('one')
  cb();
});

// gulp.on('task_start', () => {
//   console.log('task_start')
//   gulp.task('one');
// })

// exports.default = series(clean, build)