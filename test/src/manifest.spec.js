const { expect } = require('chai');

const { extractFragment, fragmentsToManifest } = require('../../src/manifest');

describe('manifest', () => {
  describe('extract fragment', () => {
    it('should extract manifest object property', () => {
      const f = {
        manifest: {
          hwRatio: 1,
          width: 200,
          format: 'png',
          variantRelativePath: 'img/some-custom.png',
          originalRelativePath: 'img/some.png',
        },
      };
      const frag = extractFragment(f);

      expect(frag).to.eql(f.manifest);
    });
  });

  describe('fragmentsToManifest', () => {
    const fragments = [
      {
        hwRatio: 1,
        width: 200,
        format: 'webp',
        variantRelativePath: 'img/some-custom.webp',
        originalRelativePath: 'img/some.png',
      },
      {
        hwRatio: 1,
        format: 'webp',
        variantRelativePath: 'img/some.webp',
        originalRelativePath: 'img/some.png',
      },
      {
        hwRatio: 1,
        width: 200,
        format: 'png',
        variantRelativePath: 'img/some-custom.png',
        originalRelativePath: 'img/some.png',
      },
      {
        hwRatio: 1,
        format: 'png',
        variantRelativePath: 'img/some.png',
        originalRelativePath: 'img/some.png',
      },
    ];
    let manifest;

    beforeEach(() => {
      manifest = fragmentsToManifest(fragments);
    });

    it('should convert fragment array to object containing manifest entries', () => {
      expect(Object.keys(manifest).length).equals(1);
      expect(manifest['img/some.png'])
        .to.be.an('object')
        .that.has.keys(['hw_ratio', 'sources']);
    });

    it('should propagate image hw_ratio', () => {
      expect(manifest['img/some.png'].hw_ratio).equals(1);
    });

    it('should produce one source per format in framgents', () => {
      expect(manifest['img/some.png'].sources.length).equals(2);
    });

    it('sources should contain srcset and mime', () => {
      expect(manifest['img/some.png'].sources[0]).to.contain.keys([
        'mime',
        'srcset',
      ]);
    });
  });
});
