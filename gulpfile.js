var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var minify = require('gulp-minify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

const siteRoot = './';

var versionDate = new Date();

var banner = ['/*!\n',
  ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2016-' + versionDate.getFullYear(), ' <%= pkg.author %>\n',
  ' * last modified: ' + versionDate, ' \n',
  ' */\n',
  ''
].join('');
/*
gulp.task('js:compress', function() {
  gulp.src('js/bootstrap.js')
    .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource: true,
        ignoreFiles: ['min.js']
    }))
    .pipe(gulp.dest('assets/js'))
});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./css/style.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('assets/css'))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile'], function(){});

// JS
gulp.task('js', ['js:compress'], function(){});

const child = require('child_process');
const gutil = require('gulp-util');
*/

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: siteRoot
    },
    open: false
  });
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  //gulp.watch('./css/*.css', gulp.parallel('css'));
  gulp.watch('./*.html', browserSync.reload);
});

// Default task
gulp.task('default', gulp.parallel('serve'));
