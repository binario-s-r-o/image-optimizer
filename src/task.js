const { curryN } = require('ramda');

const sampleSizes = [
  {
    suffix: '-sm',
    width: 640,
    height: 360,
  },
  {
    suffix: '-md',
    width: 1080,
    height: 720,
  },
  {
    suffix: '-lg',
    width: 1920,
    height: 1080,
  },
];

// file: dirname, basename, extname

const createSrcSet = curryN(4, (file, sizes, format) => {
  sizes.sort((a, b) => a.width - b.width);
});

const createImageManifest = curryN(3, (formats, sizes) => {});
