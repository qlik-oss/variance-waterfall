var gulp = require("gulp");
var gutil = require("gulp-util");
var zip = require("gulp-zip");
var del = require("del");
var webpackConfig = require("./webpack.config");
var webpack = require("webpack");
var pkg = require("./package.json");

var DIST = "./dist";
var VERSION = process.env.VERSION || "local-dev";

gulp.task("qext", () => {
  var qext = {
    name: "Variance Waterfall",
    type: "visualization",
    description: pkg.description + "\nVersion: " + VERSION,
    version: VERSION,
    icon: "waterfallchart",
    preview: "qlik-variance-waterfall.png",
    keywords: "qlik-sense, visualization",
    author: pkg.author,
    homepage: pkg.homepage,
    license: pkg.license,
    repository: pkg.repository,
    dependencies: {
      "qlik-sense": ">=5.5.x",
    },
  };
  if (pkg.contributors) {
    qext.contributors = pkg.contributors;
  }
  var src = require("stream").Readable({
    objectMode: true,
  });
  src._read = function () {
    this.push(
      new gutil.File({
        cwd: "",
        base: "",
        path: pkg.name + ".qext",
        contents: Buffer.from(JSON.stringify(qext, null, 4)),
      })
    );
    this.push(null);
  };
  return src.pipe(gulp.dest(DIST));
});

gulp.task("clean", (done) => {
  del([DIST], { force: true });
  done();
});

gulp.task("zip-build", () => {
  return gulp
    .src(DIST + "/**/*")
    .pipe(zip(`${pkg.name}_${VERSION}.zip`))
    .pipe(gulp.dest(DIST));
});

gulp.task("dev-build", () => {
  return gulp
    .src(DIST + "/**/*")
    .pipe(gulp.dest(DIST));
});

gulp.task("add-assets", () => {
  return gulp.src("./assets/**/*").pipe(gulp.dest(DIST));
});

gulp.task("webpack-build", (done) => {
  webpack(webpackConfig, (error, statistics) => {
    const compilationErrors = statistics && statistics.compilation.errors;
    const hasCompilationErrors =
      !statistics || (compilationErrors && compilationErrors.length > 0);

    console.log(
      statistics && statistics.toString({ chunks: false, colors: true })
    ); // eslint-disable-line no-console

    if (error || hasCompilationErrors) {
      console.log("Build has errors or eslint errors, fail it"); // eslint-disable-line no-console
      process.exit(1);
    }

    done();
  });
});


gulp.task("build", gulp.series("clean", "webpack-build", "qext", "add-assets"));

const changeToSourceMap = (done) => {
  if(webpackConfig.devtool !== 'source-map'){
    webpackConfig.devtool = 'source-map';
  } 
  done();
};

gulp.task("zip", gulp.series("build", "zip-build"));
gulp.task("dev", gulp.series(changeToSourceMap , "build"));
gulp.task("dev:zip", gulp.series(changeToSourceMap, "zip"));
gulp.task("default", gulp.series("build"));