module.exports = {
  mount: {
    dist: '/',
    'src/assets/js': '/js',
    'src/assets/styles': '/styles',
  },
  plugins: [
    '@snowpack/plugin-postcss',
    ['@snowpack/plugin-run-script', { cmd: 'eleventy', watch: '$1 --watch' }],
  ],
  devOptions: {
    out: 'build',
    port: 3000,
    open: 'none',
    hmr: true,
  },
};
