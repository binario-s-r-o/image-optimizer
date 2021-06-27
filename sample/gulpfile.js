const { src, dest } = require('gulp');

const { gulpResponsiveImages, collectManifest } = require('../src/gulpTask');
const preset = require('./image-presets');

const images = () =>
  src('img/**')
    .pipe(gulpResponsiveImages(preset))
    .pipe(collectManifest({ writeTo: `${__dirname}/manifest.json` }))
    .pipe(dest('dist/img'));

module.exports = { images };
