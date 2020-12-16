const mix = require('laravel-mix');

const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

const isDevelopment = !mix.inProduction();

mix.postCss('resources/css/style.css', 'public/css', [
    require('tailwindcss'),
  ])
  .webpackConfig({
    devtool: 'inline-source-map',
    devServer: {
      proxy: {
        '*': 'http://localhost:8000'
      }
    },
    entry: {
      "/js/index": [
        "./resources/ts/index.tsx",
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: path.join(__dirname, 'resources/ts'),
          use: [
            isDevelopment && {
              loader: 'babel-loader',
              options: { plugins: ['react-refresh/babel'] },
            },
            {
              loader: 'ts-loader',
              options: { transpileOnly: true },
            },
          ].filter(Boolean),
        },
      ],
    },
    plugins: [
      isDevelopment && new ReactRefreshPlugin(),
    ].filter(Boolean),
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },  
  });