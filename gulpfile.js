
//? <----- Gulp const require  ----->
const {src,watch,dest,parallel,series} = require("gulp");

//? <----- Gulp modules require ----->
const browserSync   = require("browser-sync").create();
const concat        = require("gulp-concat");
const ugly          = require("gulp-uglify");
const sass          = require("gulp-sass");
const prefix        = require("gulp-autoprefixer");
const clean         = require("gulp-clean-css");
const image         = require("gulp-imagemin");
const newer         = require("gulp-newer");
const del           = require("del")


//? <----- Browser functions : open browser,start server ----->
function browser() {
    browserSync.init({
        server: { baseDir:"app/" },
        chrome: "-browser 'chrome.exe'",
        notify:false,
        port:8080,
        open:true
    })
}

//? Script function : 
function script(params) {
    return src(['app/js/main.js','app/js/jquer.js'])
    .pipe(concat('app.min.js'))
    .pipe(ugly())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream())
}

//? 
function images(params) {
    return src('app/images/original/**/*')
    .pipe(newer("app/images/dest/"))
    .pipe(image())
    .pipe(dest('app/images/dest'))
}



//? Watch function : 
function startWatch() {
    watch(['app/**/*.js','!app/**/*.min.js'],script),
    watch(['app/sass/*.scss'],styles)
    watch(['app/**/*.html'],html)
    watch("app/images/original/**/*",images)
}

//? Styles function : 
function styles() {
    return src("app/sass/main.scss")
    .pipe(sass())
    .pipe(clean(({level:{1:{specialComments:0}}})))
    .pipe(prefix())
    .pipe(concat('app.min.css'))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream())
}

function cleaner(params) {
    return del("app/images/dest/**/*", {force:true})
}

//? HTML function : 
function html(params) {
    return src("app/*.html")
    .pipe(browserSync.stream())
}

function build(params) {
    return src(
    ['app/**/*.min.css',
    'app/**/*.min.js',
    'app/**/*.html'])
    .pipe(dest('dist'))
}

function buildImg(params) {
    return src('app/images/dest/**/*')
    .pipe(dest("dist/imgs"))
}

function cleanBuild(params) {
    return del('dist/**/*',{force:true})
}



//todo <----- Exports of gulpfile.js functions to independence functions ☕ ----->
exports.br = browser;
exports.scr = script;
exports.st = styles;
exports.im = images;
exports.dl = cleaner;
exports.bl = series(cleanBuild,styles,script,images,build,buildImg)

//todo <----- Make Exports of default gulp function,which mean all functions in params starts ✨ ----->
exports.default = parallel(script,startWatch,styles,browser,html);