const { collectManifest, gulpResponsiveImages } = require('./gulpTask');

module.exports = {
  gulpResponsiveImages,
  gulpCollectManifest: collectManifest,
};
