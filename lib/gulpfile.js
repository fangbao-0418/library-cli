const gulp = require('gulp')
const { series } = gulp
// const webpack = require('webpack')
const rimraf = require('rimraf')
var less = require('gulp-less');
const babel = require('gulp-babel')
const rollupBabel = require('rollup-plugin-babel')
const rollup = require('rollup')
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

gulp.task('dist:css', function (cb) {
  var concat = require('gulp-concat');
  return gulp.src('**/*.css', {
    cwd: output
  })
    .pipe(concat('my-library.css'))
    .pipe(gulp.dest(output))
    .on('end', cb)
})

gulp.task('dist', async function (done) {
  const resolve = require('rollup-plugin-node-resolve')
  const commonjs = require('rollup-plugin-commonjs')
  const bundle = await rollup.rollup({
    input: getOut('/'),
    external: [
      'react'
    ],
    plugins: [
      resolve(),
      commonjs(),
      rollupBabel({
        runtimeHelpers: true
        // exclude: 'node_modules/**' // 只编译我们的源代码
      })
    ]
  })
  await bundle.write({
    file: getOut('/my-library.js'),
    format: 'umd',
    name: 'library',
    exports: 'named',
    globals: {
      'react': 'React'
    }
  });
  done()
})

gulp.task('less', function (cb) {
  var postcss = require('gulp-postcss')
  var autoprefixer = require('autoprefixer')
  gulp.src(getSrc('/**/*.less'))
    .pipe(less())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest(output))
    .on('end', cb)
})

// 编译ts
gulp.task('ts', function (cb) {
  var tsProject = ts.createProject({
    declaration: true,
    rootDir: getProjectPath('./'),
    lib: [
      'es2015',
      'DOM'
    ],
    allowSyntheticDefaultImports: true,
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
    .pipe(gulp.dest(output))
    .on('end', cb)
})

gulp.task('copy', function (cb) {
  gulp.src([
   '**/*'
  ], {
    ignore: [
      '**/*.ts',
      '**/*.tsx'
    ],
    cwd: target
  })
    .pipe(gulp.dest(output))
    .on('end', cb)
})

// 编译js
gulp.task('js', function (cb) {
  console.log('complier js')
  gulp.src(
    [
      '**/*.js',
      '**/*.jsx'
    ],
    {
      cwd: output
    }
  )
    .pipe(babel(
      {
        configFile: getProjectPath('.babelrc'),
        // presets: [
        //   '@babel/preset-env'
        // ],
        // plugins: ['@babel/transform-runtime']
      }
    ))
    .pipe(gulp.dest(output))
    .on('end', cb)
})
// 删除jsx
gulp.task('cleanjsx', function (cb) {
  rimraf.sync(getOut('/**/*.jsx'))
  cb()
})

gulp.task('clean', function (cb) {
  rimraf.sync(output)
  cb()
})

const build = series(['clean', 'copy', 'ts', 'js', 'cleanjsx', 'less', 'dist', 'dist:css'])

gulp.on('task_start', (options) => {
  target = options.target
  output = options.output
  build()
})