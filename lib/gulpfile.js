const gulp = require('gulp')
const { series } = gulp
// const webpack = require('webpack')
const rimraf = require('rimraf')
// var stylus = require('gulp-stylus')
// var gulpSequence = require('gulp-sequence')
const babel = require('gulp-babel')
const { pathInfo, getProjectPath } = require('./utils/projectHelper')
var ts = require('gulp-typescript')


let target = ''
let output = ''

function getSrc (path = '') {
  return target + path
}

function getOut (path = '') {
  return output + path
}

// gulp.task('dist', function (done) {
//   rimraf.sync('./dist')
//   const webpackConfig = require('./webpack.prod.config')
//   webpack(webpackConfig, (err, stats) => {
//     if (err) {
//       console.error(err.stack || err)
//       if (err.details) {
//         console.error(err.details)
//       }
//       return
//     }

//     const info = stats.toJson()

//     if (stats.hasErrors()) {
//       console.error(info.errors)
//     }

//     if (stats.hasWarnings()) {
//       console.warn(info.warnings)
//     }

//     const buildInfo = stats.toString({
//       colors: true,
//       children: true,
//       chunks: false,
//       modules: false,
//       chunkModules: false,
//       hash: false,
//       version: false
//     })
//     done(0)
//   })
// })

gulp.task('stylus', function (cb) {
  var postcss = require('gulp-postcss')
  var autoprefixer = require('autoprefixer')
  gulp.src('components/**/*.styl')
    .pipe(stylus())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('libs'))
    .on('end', cb)
})

// 编译ts
gulp.task('ts', function (cb) {
  var tsProject = ts.createProject({
    declaration: true,
    rootDir: getProjectPath('./'),
    sourceRoot: getProjectPath('./'),
    lib: [
      'es2015',
      'DOM'
    ],
    jsx: 'react',
    esModuleInterop: true,
    moduleResolution: "Node",
    baseUrl: getProjectPath('./'),
    project: getProjectPath('./'),
  })

  gulp.src(getSrc('/**/*.ts?(x)'), {
    cwd: getProjectPath('./'),
  })
    .pipe(tsProject())
    .on('error', (err) => {
      console.log("::compile typescript fail::")
      console.log(err)
    })
    .pipe(gulp.dest(getOut()))
    .on('end', cb)
})

gulp.task('copy', function (cb) {
  gulp.src(['components/**/*.d.ts', 'components/**/*.js', 'components/**/*.@(png|jpe?g)'])
    .pipe(gulp.dest('libs'))
    .on('end', cb)
})

// 编译js
gulp.task('js', function (cb) {
  gulp.src(['libs/**/*.js', 'libs/**/*.jsx'])
    .pipe(babel())
    .pipe(gulp.dest('libs'))
    .on('end', cb)
})
// 删除jsx
gulp.task('cleanjsx', function () {
  rimraf.sync('libs/**/*.jsx')
})

gulp.task('clean', function (cb) {
  rimraf.sync(getOut())
  cb()
  // gulpSequence('ts', 'copy', 'js', 'cleanjsx', cb)
})

const build = series(['clean', 'ts'])

gulp.on('task_start', (options) => {
  target = options.target
  output = options.output

  build()
})