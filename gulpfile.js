const gulp = require('gulp');
const { task, series, src, dest } = gulp

function javascript(cb) {
  // body omitted
  console.log('javascript')
  cb();
}

function css(cb) {
  console.log('css')
  // body omitted
  cb();
}

function copy() {
  src('src/**/*.js')
    .pipe(dest('output/'));
}


task('build', function(cb) {
  // body omitted
  // console.log(cb, 'build')
  cb();
});

const build = series(['build'], javascript, css);

gulp.on('task_start', () => {
  // copy()
  // console.log('task_start')
  // build();
  s()
})
