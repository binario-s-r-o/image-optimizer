const { relative: relativePath } = require('path');
const fs = require('fs');
const { curryN, map } = require('ramda');
const { merge } = require('rxjs');
const { map: rxMap, tap, ignoreElements } = require('rxjs/operators');
const through2 = require('through2');

const { extractFragment, fragmentsToManifest } = require('./manifest');
const { prepareFormatList } = require('./planner');
const { getImageMetaP, processFile$ } = require('./sharp');

const prepareFormatSize = curryN(4, (file, hwRatio, format, size) => {
  const output = file.clone();
  output.extname = `.${format.format}`;
  output.stem = `${file.stem}${size.suffix || ''}`;
  output.manifest = {
    hwRatio,
    width: size.width,
    format: format.format,
    originalRelativePath: relativePath(file.cwd, file.path),
    variantRelativePath: relativePath(file.cwd, output.path),
  };

  return processFile$(output.contents, size.sharp).pipe(
    rxMap((buf) => {
      output.contents = buf;
      return output;
    })
  );
});

const prepareFormat$ = curryN(3, (file, hwRatio, format) => {
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

const collectManifest = ({ writeTo } = {}) => {
  if (!writeTo) {
    throw new Error('writeTo is required');
  }

  const manifestFragments = [];

  const collector = through2.obj(async (file, enc, done) => {
    manifestFragments.push(extractFragment(file));
    done(null, file);
  });

  collector.once('end', () => {
    const manifest = fragmentsToManifest(manifestFragments);
    // sync by design - it is done once on relatively small JSON
    fs.writeFileSync(writeTo, JSON.stringify(manifest));
  });

  return collector;
};

module.exports = { gulpResponsiveImages, collectManifest };
