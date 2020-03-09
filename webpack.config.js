const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = (env, argv) => {
  const devMode = (process.env.WEBPACK_DEV_SERVER === 'true') || (argv.mode === 'development');

  return {
    entry: {
      bundle: './src/js/main.js',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'js/[name].js',
    },
    module: {
      rules: [
        // JavaScript
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
                ],
              },
            },
            {
              loader: 'eslint-loader',
            },
          ],
        },
        // CSS
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { url: false, import: false, importLoaders: 1 },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('autoprefixer'),
                  ...(devMode ? [] : [require('cssnano')()]),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: devMode,
              },
            },
          ],
        },
        // Nunjucks
        {
          test: /\.(njk|nunjucks)$/,
          loader: 'nunjucks-loader',
        },
      ],
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new StyleLintPlugin(),
      new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
      new NunjucksWebpackPlugin({
        templates: [
          { from: 'src/views/layouts/page.njk', to: 'index.html' },
        ],
      }),
      ...(devMode ? [] : [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({analyzerMode: 'static'}),
      ]),
    ],
    devServer: {
      contentBase: './dist',
      hot: true,
    },
    devtool: devMode ? '#source-map' : undefined,
    stats: false,
  };
};
