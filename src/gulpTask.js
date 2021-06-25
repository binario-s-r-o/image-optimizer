const { curryN, map } = require('ramda');
const { merge } = require('rxjs');
const { map: rxMap, tap, ignoreElements } = require('rxjs/operators');
const through2 = require('through2');

const { prepareFormatList } = require('./planner');
const { getImageMetaP, processFile$ } = require('./sharp');

const prepareFormatSize = curryN(4, (file, hwRatio, format, size) => {
  const output = file.clone();
  output.extname = `.${format.format}`;
  output.stem = `${file.stem}${size.suffix || ''}`;
  output.manifest = {
    hwRatio,
    originalPath: file.path,
    width: size.width,
  };

  return processFile$(output.contents, size.sharp).pipe(
    rxMap((buf) => {
      output.contents = buf;
      return output;
    })
  );
});

const prepareFormat$ = curryN(2, (file, hwRatio, format) => {
  const sizes = map(prepareFormatSize(file, hwRatio, format), format.sizes);
  return merge(...sizes);
});

const gulpResponsiveImages = (preset) =>
  through2.obj(async function transformer(file, enc, done) {
    if (file.isDirectory()) {
      return done();
    }
    const meta = await getImageMetaP(file.contents);
    const formatList = prepareFormatList(preset, meta);

    await merge(
      ...map(prepareFormat$(file, meta.height / meta.width), formatList)
    )
      .pipe(
        tap((f) => this.push(f)),
        ignoreElements()
      )
      .toPromise();

    return done();
  });

module.exports = gulpResponsiveImages;
