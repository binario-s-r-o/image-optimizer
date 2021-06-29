const { src, dest, watch, lastRun } = require('gulp');

const { gulpResponsiveImages, collectManifest } = require('../src/gulpTask');
const preset = require('./image-presets');

const images = () =>
  src('img/**')
    .pipe(gulpResponsiveImages({ preset }))
    .pipe(collectManifest({ path: `${__dirname}/manifest.json` }))
    .pipe(dest('dist/img'));

const imagesIncremental = () =>
  src('img/**', { since: lastRun(imagesIncremental) })
    .pipe(gulpResponsiveImages({ preset }))
    .pipe(
      collectManifest({
        path: `${__dirname}/manifest.json`,
        mergeExisting: true,
      })
    )
    .pipe(dest('dist/img'));

const watchImages = () => {
  watch('img/**', imagesIncremental);
};

module.exports = { images, watchImages };
