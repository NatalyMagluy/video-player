var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

gulp.task('default', ['build']);

gulp.task('build', ['webpack'], function() {
    gulp.src(['app/index.html', 'app/bundle.js'])
        .pipe(gulp.dest('../public/app'));
});

gulp.task('webpack', function(callback) {
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});