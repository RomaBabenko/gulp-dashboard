const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");

gulp.task("clean:dev", function (done) {
  if (fs.existsSync("./build/")) {
    return gulp.src("./build/", { read: false }).pipe(clean({ force: true }));
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

gulp.task("html:dev", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest("./build/"));
});

gulp.task("sass:dev", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(plumber(plumberNotify("Scss")))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./build/css/"));
});

gulp.task("img:dev", function () {
  return gulp
    .src("./src/img/**/*")
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./build/img/"));
});

gulp.task("fonts:dev", function () {
  return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./build/fonts/"));
});

gulp.task("files:dev", function () {
  return gulp.src("./src/files/**/*").pipe(gulp.dest("./build/files/"));
});

gulp.task("server:dev", function () {
  return gulp.src("./build/").pipe(server(serverSettings));
});

gulp.task("watch:dev", function () {
  gulp.watch("./src/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
  gulp.watch("./src/img/**/*", gulp.parallel("img:dev"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:dev"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
});
