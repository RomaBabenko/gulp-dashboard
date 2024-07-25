const gulp = require("gulp");

const fileInclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");
const webpHTML = require("gulp-webp-html");
const changed = require("gulp-changed");

const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const webpCss = require("gulp-webp-css");

const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");

const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

gulp.task("clean:docs", function (done) {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ force: true }));
  }
  done();
});

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

const serverSettings = {
  livereload: true,
  open: true,
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      massage: "Error <%= error.massage%>",
      sound: false,
    }),
  };
};

gulp.task("html:docs", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./build/", { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest("./docs/"));
});

gulp.task("sass:docs", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(plumber(plumberNotify("Scss")))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./docs/css/"));
});

gulp.task("img:docs", function () {
  return gulp
    .src("./src/img/**/*")
    .pipe(webp())
    .pipe(gulp.dest("./docs/img/"))
    .pipe(gulp.src("./src/img/**/*"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./docs/img/"));
});

gulp.task("fonts:docs", function () {
  return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./docs/fonts/"));
});

gulp.task("files:docs", function () {
  return gulp.src("./src/files/**/*").pipe(gulp.dest("./docs/files/"));
});

gulp.task("server:docs", function () {
  return gulp.src("./docs/").pipe(server(serverSettings));
});
