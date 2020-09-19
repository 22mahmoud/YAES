# YAES - Yet another eleventy starter.

![yaes logo](src/assets/images/favicon-180x180.png)

## Tech Stack 🥞

- Eleventy (11ty)
- Postcss
- Snowpack
- Webpack
- Babel
    
## Features

- Fast development using snowpack.
- Bundle & minify the output using webpack.
- Native lazy loading.
- A custom shortcode for image `{% Image src="./bg.jpeg", alt="background" %}`.
  - Generate multiple sizes for each image.
  - Generate blurry placeholder.
  - Transcode images to webp and generate `picture` element.
  - Native Lazy loading.
  - Download remote images.
  - Minify all images using `imagemin`.
- Modern css using Postcss.
  - Inline the critical css and lazy load the rest of css.
  - Remove unwanted css using purgecss.
  - Minify the output using cssnano.
