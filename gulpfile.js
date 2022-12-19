"use strict";
const { src, dest, parallel, series, watch } = require('gulp');
// const pug = require('gulp-pug'); // Pug default view template
const sass = require('gulp-dart-sass');
const prefix = require('gulp-autoprefixer');
const data = require('gulp-data');
//const minifyCSS = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browsersync = require('browser-sync');
const gulpcopy = require('gulp-copy');
const fs = require('fs');
// del = require('del');
const path = require('path');


/*
 * Directories here
 */
var paths = {
    build: 'build/',
    frontend: 'app/js/front-end/',
    backend: 'app/back-end/',
    buildData: 'app/back-end/',
    sass: 'app/src/scss/editor/',
    scss: 'app/src/scss/',
    css: 'app/dist/css/',
    base: 'app/'
};

// SCSS bundled into CSS task
function css() {
  return src(paths.sass+'*.scss')
    .pipe(sourcemaps.init())
    // Stay live and reload on error
    .pipe(plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sass({
        includePaths: [paths.scss + 'vendors/'],
        outputStyle: 'compressed'
    }).on('error', function (err) {
        console.log(err.message);
        // sass.logError
        this.emit('end');
    }))
    .pipe(prefix(['last 15 versions','> 1%','ie 8','ie 7','iOS >= 9','Safari >= 9','Android >= 4.4','Opera >= 30'], {
        cascade: true
    }))
    //.pipe(minifyCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.css));
}

function prepareEditorCss() {
    return src(paths.sass + 'editor.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.css));
}
function prepareCardsCss() {
    return src(paths.sass + 'editor-cards.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.css));
}
/*
 * Build
 */
function updateBuildNumber (cb) {
    let buildData = JSON.parse(fs.readFileSync(paths.buildData + 'builddata.json'));
    buildData.build += 1;
    buildData = JSON.stringify(buildData);
    fs.writeFileSync(paths.buildData + 'builddata.json', buildData);
    cb();
}
/**
 * Copy assets directory
 */
 function copyAssets() {
    // Copy assets
    return src(['./client/assets/**/*.*','!./client/assets/**/*.psd','!./client/assets/**/*.*.map'],
        //del(paths.build + 'assets/**/*')
    )
    .pipe(gulpcopy(paths.build + 'assets', { prefix: 2 }));
}
// copy afterPack.js script

function afterPack() {
    // Copy assets
    return src(['afterPack.js'],
        //del(paths.build + 'assets/**/*')
    )
    .pipe(gulpcopy(paths.build + 'scripts', { prefix: 2 }));
}
// BrowserSync
function browserSync() {
    browsersync({
        server: {
            baseDir: paths.build
        },
        notify: false,
        browser: "google chrome",
        // proxy: "0.0.0.0:5000"
    });
}

// BrowserSync reload 
function browserReload () {
    return browsersync.reload;
}

// Watch files
function watchFiles() {
    // Watch SCSS changes    
    watch(paths.scss + '**/*.scss', parallel(css))
    .on('change', browserReload());
    // // Watch javascripts changes    
    // watch(paths.js + '*.js', parallel(js))
    // .on('change', browserReload());
    // Assets Watch and copy to build in some file changes
    watch(watch.css + '**/*')
    .on('change', series(copyAssets, css, browserReload()));
}

const watching = parallel(watchFiles, prepareCardsCss, prepareEditorCss,updateBuildNumber, browserSync);
const build = parallel(afterPack, prepareCardsCss, prepareEditorCss,updateBuildNumber);
exports.css = css;
exports.prepareEditorCss = prepareEditorCss;
exports.prepareCardsCss = prepareCardsCss;
exports.updateBuildNumber = updateBuildNumber;
exports.default = parallel(copyAssets, css);
exports.watch = watching;
exports.build = build;
exports.afterPack = afterPack;


