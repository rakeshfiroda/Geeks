const gulp = require('gulp');
const webp = require('gulp-webp');
const minify = require('gulp-minify');
const sass = require('gulp-sass')(require('sass'));

// Convert images to WebP
gulp.task('webp', () => {
    return gulp.src('images/*.png')
        .pipe(webp())
        .pipe(gulp.dest('images/webps/'));
});

// Minify Js
gulp.task('minify', () => {
    return gulp.src('script.js')
        .pipe(minify())
        .pipe(gulp.dest('Js/'));
});

// Scss to Css
gulp.task('style', () => {
    return gulp.src('styles.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('CSS/'));
});

// Automate conversion of scss to css in every change
gulp.task('watch-style', () => {
    return gulp.watch('styles.scss', (done) => {
        gulp.series(['style'])(done);
    })
});