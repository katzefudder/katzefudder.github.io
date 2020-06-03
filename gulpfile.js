var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var inject = require('gulp-inject');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var concatJs = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var minify = require('gulp-minify');
var pkg = require('./package.json');
var del = require('del');
var browserSync = require('browser-sync').create();

const siteRoot = './website';

var versionDate = new Date();

var banner = ['/*!\n',
  ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2016-' + versionDate.getFullYear(), ' <%= pkg.author %>\n',
  ' * last modified: ' + versionDate, ' \n',
  ' */\n',
  ''
].join('');

var jsAssets = [
  'website/js/jquery.1.11.1.js',
  'website/js/SmoothScroll.js',
  'website/js/flickr.js',
  'website/js/main.js'
];

var cssAssets = [
  'website/css/bootstrap.css',
  'website/css/style.css',
  'website/css/font-awesome/css/font-awesome.css'
];

gulp.task('js:bundle', function() {
  return gulp.src(jsAssets)
    .pipe(concatJs('main.js'))
    .pipe(gulp.dest('js/compiled'))
});

gulp.task('js:minify', function() {
  return gulp.src('js/compiled/**/*.js')
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource: true,
        ignoreFiles: ['min.js']
    }))
    .pipe(gulp.dest('js'))
});

gulp.task('css:bundle', function () {
  return gulp.src(cssAssets)
    .pipe(concatCss("style.css"))
    .pipe(gulp.dest('css/compiled'));
});

gulp.task('css:minify', function(){
  return gulp.src('css/compiled/**/*.css')
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(minifyCSS())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('website/css'))
});

gulp.task('cleanupJs', function(){
  return del(["js/compiled/"]);
});

gulp.task('cleanupCss', function(){
  return del(["css/compiled/"]);
});

// Configure the browserSync task
gulp.task('browserSync', function(done) {
  browserSync.init({
    server: {
      baseDir: siteRoot
    },
    open: false
  });
  done();
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(['./css/*.css', '!./css/style.min.css'], gulp.series('css', 'reload'));
  gulp.watch(['./js/*.js', '!./js/main.min.js'], gulp.series('js', 'reload'));
  gulp.watch(['./*.html', '!index.html'], gulp.series('js', 'reload'));
});

gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});

gulp.task('js', gulp.series('js:bundle', 'js:minify', 'cleanupJs'));
gulp.task('css', gulp.series('css:bundle', 'css:minify', 'cleanupCss'));
gulp.task('build', gulp.series('js', 'css'));

// Default task
gulp.task('default', gulp.series('serve'));
