const StyleLintPlugin = require("stylelint-webpack-plugin");
const packageJSON = require("./package.json");
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const DIST = path.resolve("./dist");
const MODE = process.env.NODE_ENV || "development";
const SOURCE_MAP = "source-map";
const DEVTOOL = process.env.NODE_ENV === "development" ? SOURCE_MAP : false;

console.log("Webpack mode:", MODE); // eslint-disable-line no-console

const eslintPluginOptions = {
  // enforce: "pre",
  // test: /\.js?$/,
  extensions: ["js", "jsx", "ts"],
  exclude: ["/(node_modules)/", "/Library/"],
  failOnError: true,
};

const config = {
  devtool: DEVTOOL,
  entry: ["./src/index.js"],
  mode: MODE,
  output: {
    filename: `${packageJSON.name}.js`,
    libraryTarget: "amd",
    path: DIST,
  },
  externals: {
    qlik: {
      amd: "qlik",
      commonjs: "qlik",
      commonjs2: "qlik",
      root: "_",
    },
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new StyleLintPlugin(), new ESLintPlugin(eslintPluginOptions)],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

module.exports = config;
