const fs = require('fs');
const fg = require('fast-glob');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const src = resolveApp('src');

module.exports = {
  src,

  root: appDirectory,

  imagesDest: resolveApp('dist/images'),

  webpack: {
    entry: [resolveApp('build/js/app'), resolveApp('build/styles/main.css')],
    output: {
      path: resolveApp('public'),
    },
  },

  html: {
    glob: fg.sync(resolveApp('dist/**/*.html'), { dot: false }),
  },
};
