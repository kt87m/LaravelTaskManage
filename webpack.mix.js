const mix = require('laravel-mix');

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

mix.ts('resources/ts/index.tsx', 'public/js')
  .postCss('resources/css/style.css', 'public/css', [
    require('tailwindcss'),
  ]);

mix.webpackConfig({
  devServer: {
      proxy: {
          '*': 'http://localhost:8000'
      }
  }
});