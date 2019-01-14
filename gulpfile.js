var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var minimist = require('minimist');
var browserSync = require('browser-sync').create();
var gulpSequence = require('gulp-sequence')

var envOptions = {
    string: 'env',
    default: {
        env: 'develop'
    }
};
var options = minimist(process.argv.slice(2), envOptions)
console.log(options);

//刪除先前生成的資料夾
gulp.task('clean', function () {
    return gulp.src('./public', { read: false })
        .pipe($.clean());
});

//編譯jade生成html
gulp.task('jade', function () {
    // var YOUR_LOCALS = {};
    gulp.src('./source/*.jade')
        .pipe($.plumber())
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream())
});
//編譯sass生成CSS
gulp.task('sass', function () {
    var plugins = [
        autoprefixer({ browsers: ['last 1 version'] }),
    ];

    return gulp.src('./source/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        //編譯完成CSS
        .pipe($.postcss(plugins))
        .pipe($.if(options.env === 'prod', $.cleanCss())) //production
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream())
});
//生成js
gulp.task('babel', () =>
    gulp.src(['./source/js/**/jquery-3.3.1.min.js', './source/js/**/*.js'])
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['@babel/env']
        }))
        .pipe($.concat('all.js'))
        .pipe($.if(options.env === 'prod', $.uglify({ //production
            compress: {
                drop_console: true
            }
        })))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.stream())
);
//壓縮image並生成image
gulp.task('image-min', function () {
    gulp.src(['./source/images/*','./source/images/**/*'])
        .pipe($.if(options.env === 'prod', $.imagemin())) //production
        .pipe(gulp.dest('./public/images'))
});

//執行webserver
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
});

//監控
gulp.task('watch', function () {
    gulp.watch('./source/scss/*.scss', ['sass']);
    gulp.watch('./source/js/*.js', ['js']);
    gulp.watch('./source/*.jade', ['jade']);
});

gulp.task('deploy', function () {
    return gulp.src('./public/**/*')
        .pipe($.ghPages());
});

//依照順序執行
gulp.task('bulid', gulpSequence('clean', 'jade', 'sass', 'babel', 'image-min'))

//預設執行
gulp.task('default', ['jade', 'sass', 'babel', 'image-min', 'browser-sync', 'watch']);