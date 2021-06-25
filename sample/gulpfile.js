const { src, dest } = require('gulp');

const gulpResponsiveImages = require('../src/gulpTask');
const preset = require('./image-presets');

const images = () =>
  src('img/**').pipe(gulpResponsiveImages(preset)).pipe(dest('dist/img'));

module.exports = { images };
