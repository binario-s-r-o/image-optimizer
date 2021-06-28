const { expect } = require('chai');

const { gulpCollectManifest, gulpResponsiveImages } = require('../../src');

describe('index', () => {
  it('should export gulpResponsiveImages stream transform factory', () => {
    expect(gulpResponsiveImages).to.be.an('function');
  });

  it('should export gulpCollectManifest stream transform factory', () => {
    expect(gulpCollectManifest).to.be.an('function');
  });
});
