const { createManifestEntry } = require('./src/manifest');

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

const file = { dirname: '', basename: 'img1', extname: 'jpeg' };

const meta = { width: 2560 };

console.log(createManifestEntry(preset, file, meta));
