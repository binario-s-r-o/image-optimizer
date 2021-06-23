const { prepareTransformManifest } = require('./src/planner');

const preset = {
  manifest: {
    enable: true,
    name: 'image-manifest.json',
    save: './path/to/dir',
  },
  extraFormats: ['avif', 'webp'],
  original: {
    maxWidth: 2560, // in pixels
    maxHeight: 1440, // in pixels
    strategy: 'fit', // 'fit' | 'cover' | 'contain'; default -> 'fit'
    allowedFormats: ['jpeg', 'png', 'gif'],
    fallbackFormat: 'jpeg',
  },
  sizes: [
    {
      suffix: '-sm',
      width: 640,
    },
    {
      suffix: '-md',
      width: 1080,
    },
    {
      suffix: '-lg',
      width: 1920,
    },
  ],
};

const meta = { width: 2560, format: 'png' };

const file = { dirname: '/img', basename: 'img223' };

console.log(
  JSON.stringify(prepareTransformManifest(preset, file, meta), null, 2)
);
