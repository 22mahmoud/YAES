const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const rfs = require('rfs/postcss');

const plugins = [
  autoprefixer,
  postcssPresetEnv({
    stage: 3,
    features: {
      'nesting-rules': true,
    },
  }),
  rfs({
    twoDimensional: false,
    baseValue: 20,
    unit: 'rem',
    breakpoint: 1200,
    breakpointUnit: 'px',
    factor: 10,
    class: false,
    unitPrecision: 6,
    safariIframeResizeBugFix: false,
    remValue: 16,
  }),
];

module.exports = {
  plugins,
};
