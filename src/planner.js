const {
  pipe,
  curryN,
  propOr,
  filter,
  pathSatisfies,
  lt,
  path,
  contains,
  ifElse,
  always,
  identity,
  append,
  applySpec,
  pathOr,
  map,
  converge,
  prop,
} = require('ramda');

// 1. prepare sizes based on meta and preset
// 2. prepare original format based on meta and preset
// 3. prepare formats list
//    - list of objects containing format, mime, sizes
//    - sizes contain filenames and sizes

const prepareSizes = curryN(2, (preset, meta) =>
  pipe(
    propOr([], 'sizes'),
    filter(pathSatisfies(lt(meta.width))),
    append({ original: true }) // append object to force original transformation
  )(preset)
);

const prepareSingleFormat = curryN(2, (sizes, format) =>
  applySpec({
    mime: (f) => `image/${f}`,
    format: identity,
    sizes: always(sizes),
  })(format)
);

const prepareExtraFormats = curryN(2, (preset, sizes) =>
  pipe(pathOr([], ['extraFormats']), map(prepareSingleFormat(sizes)))(preset)
);

const prepareOriginalFormat = curryN(3, (preset, meta, sizes) =>
  pipe(
    path(['original', 'allowedFormats']),
    contains(meta.format),
    ifElse(
      identity,
      always(meta.format),
      always(preset.original.fallbackFormat)
    ),
    prepareSingleFormat(sizes)
  )(preset)
);

const prepareFormatList = curryN(2, (preset, meta) =>
  pipe(
    prepareSizes(preset),
    converge(append, [
      prepareOriginalFormat(preset, meta),
      prepareExtraFormats(preset),
    ])
  )(meta)
);

const prepareTransformManifest = curryN(3, (preset, file, meta) =>
  applySpec({
    file: pipe(
      always(file),
      applySpec({ dirname: prop('dirname'), basename: prop('basename') })
    ),
    formatList: prepareFormatList(preset),
  })(meta)
);

module.exports = { prepareTransformManifest };
