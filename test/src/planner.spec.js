const { expect } = require('chai');

const { prepareFormatList } = require('../../src/planner');

// const mockPreset = {

// };

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
      const fl = prepareFormatList(null, {
        width: 5000,
        heigth: 5000,
        format: 'jpeg',
      });

      expect(Array.isArray(fl)).equals(true);
      expect(fl.length).equals(3);
      expect(fl[0].format).equals('avif');
      expect(fl[0].sizes.length).equals(4);
      expect(fl[1].format).equals('webp');
      expect(fl[1].sizes.length).equals(4);
      expect(fl[2].format).equals('jpeg');
      expect(fl[2].sizes.length).equals(4);
    });

    it('should use values from provided preset over default preset', () => {
      const fl = prepareFormatList(mockPreset, )
    });
  });
});
