//
const {src,watch,dest,parallel,series} = require("gulp");
//
const browserSync   = require("browser-sync").create();
const concat        = require("gulp-concat");
const ugly          = require("gulp-uglify");
const sass          = require("gulp-sass");
const prefix        = require("gulp-autoprefixer");
const clean         = require("gulp-clean-css")

//
function browser() {
    browserSync.init({
        server: { baseDir:"app/" },
        chrome: "-browser 'chrome.exe'",
        notify:false,
        port:8080,
        open:true
    })
}
//
function script(params) {
    return src(['app/js/main.js','app/js/jquer.js'])
    .pipe(concat('app.min.js'))
    .pipe(ugly())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream())
}
//
function startWatch() {
    watch(['app/**/*.js','!app/**/*.min.js'],script),
    watch(['app/sass/*.scss'],styles)
}
//
function styles() {
    return src("app/sass/main.scss")
    .pipe(sass())
    .pipe(clean(({level:{1:{specialComments:0}}})))
    .pipe(concat('app.min.css'))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream())
}
//
exports.br = browser;
exports.scr = script;
exports.st = styles;

exports.default = parallel(script,startWatch,styles);