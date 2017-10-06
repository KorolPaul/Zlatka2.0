"use strict"

var lr = require('tiny-lr'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    connectlr = require('connect-livereload'),
    image = require('gulp-image'),
    svg2png = require('gulp-svg2png'),
    server = lr(),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    htmlSnapshots = require('html-snapshots');

gulp.task('server', function () {
    connect.server({
        //livereload: true,
        port: 3000
    })
});

gulp.task('html', function () {
    gulp.src('*.html')
        .pipe(connect.reload());
});

gulp.task('img', function () {
    gulp.src('src/img/**/*.{png,jpg,gif,svg}')
        .pipe(image())
        .pipe(gulp.dest('./Content/img'));
});

gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./Content'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('script.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./Content'))
        .pipe(connect.reload());
});


gulp.task('watch', function () {
    gulp.watch(['*.html', 'src/scss/**/*.scss', 'src/js/**/*.js'], ['html', 'sass', 'js']);
});

gulp.task('snapshot', function () {
    htmlSnapshots.run({
        input: "sitemap",
        source: "sitemap.xml",
        outputDir: "./snapshots",
        outputDirClean: true,
        //checkInterval: 5000,
        //pollInterval: 10000,
        selector: ".info.opened"

      })
      .then(function (completed) {
        // completed is an array of full file paths to the completed snapshots.
      })
      .catch(function (errorObject) {
        console.log(errorObject.notCompleted)
      });
});

gulp.task('default', function () {
    gulp.run('watch');
});