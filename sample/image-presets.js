module.exports = {
  manifest: {
    enable: true,
    name: "image-manifest.json",
    save: "./path/to/dir",
  },
  extraFormats: ["avif", "webp"],
  original: {
    maxWidth: 2560, // in pixels
    maxHeight: 1440, // in pixels
    strategy: 'fit', // 'fit' | 'cover' | 'contain'; default -> 'fit'
    allowedFormats: ['jpeg', 'png', 'gif'],
    fallbackFormat: 'jpeg',
  },
  sizes: [
    {
      name: "small", // maybe not needed?
      suffix: "-sm", // optional
      maxWidth: 640, // required
      height: 360, // optional
    },
    {
      name: "medium", // maybe not needed?
      suffix: "-md", // optional
      width: 1080, // required
      height: 720, // optional
    },
    {
      name: "large", // maybe not needed?
      suffix: "-lg", // optional
      maxWidth: 1920, // required
      height: 1080, // optional
    },
  ],
};
