const { expect } = require('chai');

const { prepareFormatList } = require('../../src/planner');

const mockPreset = {
  original: {
    maxWidth: 2000,
  },
  extraFormats: [],
  sizes: [
    {
      suffix: '-custom',
      width: 1366,
    },
  ],
};

const mockMeta = {
  width: 5000,
  height: 5000,
  format: 'png',
};

describe('planner', () => {
  describe('prepareFormatList', () => {
    it('should be a function', () => {
      expect(typeof prepareFormatList).equals('function');
    });

    it('should curried with arity 2', () => {
      expect(prepareFormatList.length).equals(2);
      expect(prepareFormatList({}).length).equals(1);
    });

    it('should use default preset when not specified', () => {
      const fl = prepareFormatList(null, mockMeta);

      expect(Array.isArray(fl)).equals(true);
      expect(fl.length).equals(3);
      expect(fl[0].format).equals('avif');
      expect(fl[0].sizes.length).equals(4);
      expect(fl[1].format).equals('webp');
      expect(fl[1].sizes.length).equals(4);
      expect(fl[2].format).equals('png');
      expect(fl[2].sizes.length).equals(4);
    });

    it('should use values from provided preset over default preset', () => {
      const fl = prepareFormatList(mockPreset, mockMeta);

      expect(fl.length).equals(1);
      expect(fl[0].sizes.length).equals(2);
      expect(fl[0].format).equals('png');
      expect(fl[0].sizes[1].sharp.resize.height).equals(1440);
    });

    it('should apply global format settings', () => {
      const lp = { sharpFormatSettings: { png: { custom: 'setting' } } };

      const fl = prepareFormatList(lp, mockMeta);

      expect(fl[2].sizes[1].sharp.format.options.custom).equals('setting');
    });

    it('should override global format settings with size specific format settings', () => {
      const lp = {
        sharpFormatSettings: { png: { custom: 'setting' } },
        sizes: [
          {
            suffix: '-custom',
            width: 200,
            sharpFormatSettings: { png: { custom: 'other' } },
          },
        ],
      };

      const fl = prepareFormatList(lp, mockMeta);

      expect(fl[2].sizes[0].sharp.format.options.custom).equals('other');
    });
  });
});
