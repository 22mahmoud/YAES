const path = require('path');
const Image = require('@11ty/eleventy-img');
const sharp = require('sharp');

const paths = require('../paths');

async function getPlaceHolder(outputPath) {
  const placeholder = await sharp(outputPath)
    .resize({ fit: sharp.fit.inside })
    .blur()
    .toBuffer();

  return placeholder;
}

function generateSrcset(stats) {
  return Object.keys(stats).reduce(
    (acc, format) => ({
      ...acc,
      [format]: stats[format].reduce(
        (_acc, curr) => `${_acc} ${curr.srcset} ,`,
        ''
      ),
    }),
    {}
  );
}

function getSrc(relativeSrc, outputPath) {
  let src = relativeSrc;

  if (relativeSrc.startsWith('https://')) {
    // do nothing
  } else if (process.env.NODE_ENV === 'development') {
    src = path.join(
      '/' + outputPath.split('/').slice(2, -1).join('/'),
      relativeSrc
    );
  } else {
    src = path.relative(
      paths.root,
      path.resolve(outputPath.split('/').slice(0, -1).join('/'), relativeSrc)
    );
  }

  return src;
}

async function handleImage({ src: relativeSrc, alt }) {
  if (!alt) throw new Error(`Missing \`alt\` on myImage from: ${src}`);

  const src = getSrc(relativeSrc, this.page.inputPath);

  if (process.env.NODE_ENV === 'development') {
    return `<div class='image-wrapper'>
      <img src=${src} alt=${alt} />
    </div>`;
  }

  let stats = await Image(src, {
    widths: [24, 320, 640, 960, 1200, 1800, 2400],
    formats: ['jpeg', 'webp'],
    urlPath: '/images/',
    outputDir: paths.imagesDest,
  });

  const originalSrc = stats['jpeg'][stats['jpeg'].length - 1];

  const placeholder = await getPlaceHolder(stats['webp'][0].outputPath);

  const srcset = generateSrcset(stats);

  const sourceWebp = `<source type="image/webp" sizes="(min-width: 1024px) 1024px, 100vw" srcset="${srcset['webp']}">`;
  const sourceJpeg = `<source type="image/jpeg" sizes="(min-width: 1024px) 1024px, 100vw" srcset="${srcset['jpeg']}">`;

  const img = `<img
    loading="lazy"
    alt="${alt}"
    src="${originalSrc.url}"
    decoding="async"
    style="background-size:cover;background-image:url(data:image/webp;base64,${placeholder.toString(
      'base64'
    )});"
    width="${originalSrc.width}"
    height="${originalSrc.height}">`;

  return `<div class="image-wrapper"> <picture> ${sourceWebp} ${sourceJpeg} ${img} </picture> </div>`;
}

module.exports = { handleImage };
