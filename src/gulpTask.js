const { curryN, map } = require('ramda');
const { merge } = require('rxjs');
const { map: rxMap } = require('rxjs/operators');
const through2 = require('through2');

const { prepareFormatList } = require('./planner');
const { getImageMetaP, processFile$ } = require('./sharp');

const prepareFormatSize = curryN(3, (file, format, size) => {
  const output = file.clone();
  output.extname = format.format;
  output.stem = `${file.stem}${size.suffix || ''}`;

  processFile$(output.contents, size.sharp).pipe(
    rxMap((buf) => {
      output.contents = buf;
      return output;
    })
  );
});

const prepareFormat$ = curryN(2, (file, format) => {
  const sizes = map(prepareFormatSize(file, format), format.sizes);
  return merge(...sizes);
});

const gulpResponsiveImages = (preset) => {
  const manifest = {};

  const transform = through2.obj(async (file, enc, done) => {
    if (file.isDirectory()) {
      return done();
    }
    const meta = await getImageMetaP(file.contents);
    const formatList = prepareFormatList(preset, meta);

    console.log(JSON.stringify(formatList, null, 2));

    return done();
  });

  transform.once('end', () => {
    // export manifest
  });

  return transform;
};

module.exports = gulpResponsiveImages;
