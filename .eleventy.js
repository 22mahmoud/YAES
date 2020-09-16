const { handleImage } = require('./config/eleventy/image');

module.exports = (cfg) => {
  cfg.addPassthroughCopy({ 'src/assets/fonts': 'fonts' });
  cfg.addPassthroughCopy({ 'src/static': 'assets' });

  /* Filters */
  cfg.addFilter('jsAsset', (name) => {
    return manifest[name];
  });

  /* shortcodes */
  cfg.addNunjucksAsyncShortcode('Image', handleImage);

  return {
    // use nunjucks as the main template engine.
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    // change default inputs and output directories.
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
  };
};
