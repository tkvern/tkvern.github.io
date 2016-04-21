gulp = require('gulp')
jshint = require('gulp-jshint')
stylish = require('jshint-stylish')
uglify = require('gulp-uglify')
notify = require('gulp-notify')
minifycss = require('gulp-minify-css')

gulp.task 'js', ->
  return gulp.src([
    './source/js/src/utils.js',
    './source/js/src/motion.js',
    './source/js/src/hook-duoshuo.js'
    './source/js/src/bootstrap.js',
    './source/js/src/post-details.js',
    './source/js/src/schemes/pisces.js'
  ]).pipe jshint()
    .pipe jshint.reporter(stylish)
    .pipe uglify()
    .pipe gulp.dest('./source/js/src/')
    .pipe notify({ message: 'JS file is done' })

gulp.task 'css', ->
  return gulp.src([
    './source/vendors/**/*.css'
  ]).pipe minifycss()
    .pipe gulp.dest('./source/vendors/')    
    .pipe notify({ message: 'Css file is done' })


gulp.task 'vendorsjs', ->
  return gulp.src([
    './source/vendors/jquery_lazyload/*.js'
  ]).pipe jshint()
    .pipe jshint.reporter(stylish)
    .pipe uglify()
    .pipe gulp.dest('./source/vendors/jquery_lazyload/')
    .pipe notify({ message: 'JS file is done' })