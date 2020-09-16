const fs = require('fs');
const fg = require('fast-glob');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const resolveSrc = (relativePath) =>
  path.resolve(resolveApp('src'), relativePath);

const resolveDist = (relativePath) =>
  path.resolve(resolveApp('dist'), relativePath);

const resolveAssets = (relativePath) =>
  path.resolve(resolveSrc('assets'), relativePath);

const src = resolveApp('src');
const dest = resolveApp('dist');

module.exports = {
  src,

  dest,

  root: appDirectory,

  imagesDest: resolveDist('images'),

  eleventy: {
    watch: [
      resolveSrc('**/*.{njk,md,json,js}'),
      resolveApp('.eleventy.js'),
      `!${resolveAssets('js')}`,
    ],
  },

  html: {
    src: resolveDist('**/*.html'),
    dest,
    htmlGlob: fg.sync(resolveDist('**/*.html'), { dot: false }),
  },

  css: {
    src: resolveAssets('styles'),
    dest: resolveDist('styles'),

    mainSrc: resolveAssets('styles/main.css'),
    mainDest: resolveDist('styles/main.css'),

    watch: resolveAssets('styles/**/*.css'),
  },

  js: {
    src: resolveAssets('js/app.js'),
    dest: resolveDist('js'),
    watch: resolveAssets('js/**/*.js'),
  },

  images: {
    src: fg.sync(resolveSrc('**/*.{jpg,jpeg,png}'), { dot: false }),
  },
};
