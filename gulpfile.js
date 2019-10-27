var gulp = require('gulp'); 
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tsProject = ts.createProject("tsconfig.json");

function sassCompile(cb) {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'));
        cb();
}

function typescript(cb) {
    return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("app/js/dist"))
    cb(); 
}

function watch() {
    gulp.watch('app/scss/**/*.scss', sassCompile)
    gulp.watch('app/js/**/*.ts', typescript);
}

exports.sass = sassCompile; 
exports.ts = typescript; 
exports.watch = watch; 