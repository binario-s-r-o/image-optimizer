module.exports = {
  extraFormats: ['avif', 'webp'],
  original: {
    // max dimensions -> does not upscale
    maxWidth: 2560, // in pixels
    maxHeight: 1440, // in pixels
    allowedFormats: ['jpeg', 'png', 'gif'],
    fallbackFormat: 'png',
  },
  sharpFormatSettings: {
    jpeg: { quality: 80 }, // https://sharp.pixelplumbing.com/api-output#jpeg
    png: {}, // https://sharp.pixelplumbing.com/api-output#png
    webp: {}, // https://sharp.pixelplumbing.com/api-output#webp
    avif: {}, // https://sharp.pixelplumbing.com/api-output#avif
  },
  sizes: [
    {
      suffix: '-sm',
      width: 640,
      sharpFormatSettings: {}, // Override global format settings per size
    },
    {
      suffix: '-md',
      width: 1080,
      height: 720, // optional
    },
    {
      suffix: '-lg',
      width: 1920,
    },
  ],
};
