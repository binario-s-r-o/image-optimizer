const { curryN, map } = require('ramda');
const { merge } = require('rxjs');
const { map: rxMap, tap, ignoreElements } = require('rxjs/operators');
const through2 = require('through2');

const { prepareFormatList } = require('./planner');
const { getImageMetaP, processFile$ } = require('./sharp');

const prepareFormatSize = curryN(3, (file, format, size) => {
  const output = file.clone();
  output.extname = `.${format.format}`;
  output.stem = `${file.stem}${size.suffix || ''}`;

  console.log(format.format);

  return processFile$(output.contents, size.sharp).pipe(
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

  const transform = through2.obj(async function transformer(file, enc, done) {
    if (file.isDirectory()) {
      return done();
    }
    const meta = await getImageMetaP(file.contents);
    const formatList = prepareFormatList(preset, meta);

    await merge(...map(prepareFormat$(file), formatList))
      .pipe(
        tap((f) => this.push(f)),
        ignoreElements()
      )
      .toPromise();

    return done();
  });

  transform.once('end', () => {
    // export manifest
  });

  return transform;
};

module.exports = gulpResponsiveImages;
