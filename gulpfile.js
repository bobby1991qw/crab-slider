var gulp = require('gulp'),
    browser = require('browser-sync').create(),
    babel = require('gulp-babel');

gulp.task('es6', function () {
    gulp.src('./es6/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./js'));

    gulp.watch('./es6/*.js', ['es6']);
});

gulp.task('dev', ['es6'], function () {
    browser.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch([
        './css/*.css',
        './js/*.js',
        './index.js',
        './index.html'
    ], browser.reload);
});
