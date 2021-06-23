const {
  pipe,
  curryN,
  propOr,
  filter,
  pathSatisfies,
  lt,
  path,
  includes,
  ifElse,
  always,
  identity,
  append,
  applySpec,
  pathOr,
  map,
  converge,
  // prop,
  T,
  nthArg,
  pickBy,
  flip,
  mergeDeepLeft,
  assoc,
} = require('ramda');

// 1. prepare sizes based on meta and preset
// 2. prepare original format based on meta and preset
// 3. prepare formats list
//    - list of objects containing format, mime, sizes
//    - sizes contain filenames and sizes

const RESIZE_PROPS = [
  'width',
  'height',
  'fit',
  'position',
  'background',
  'kernel',
  'withoutEnlargement',
  'fastShrinkOnLoad',
];

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
    includes(meta.format),
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

// const prepareTransformManifest = curryN(3, (preset, file, meta) =>
//   applySpec({
//     file: pipe(
//       always(file),
//       applySpec({
//         cwd: prop('cwd'),
//         dirname: prop('dirname'),
//         basename: prop('basename'),
//       })
//     ),
//     formatList: prepareFormatList(preset),
//   })(meta)
// );

const extractSizeResizeProps = pickBy(
  pipe(nthArg(1), flip(includes)(RESIZE_PROPS))
);

const computeResizeProps = curryN(2, (preset, size) =>
  pipe(
    applySpec({
      width: pathOr(2560, ['original', 'maxWidth']),
      height: pathOr(1440, ['original', 'maxHeight']),
      withoutEnlargement: T,
      fit: always('contain'),
    }),
    mergeDeepLeft(extractSizeResizeProps(size))
  )(preset)
);

const computeFormatProps = curryN(3, (preset, format, size) =>
  pipe(
    converge(mergeDeepLeft, [
      pathOr({}, ['size', 'sharpFormatSettings', format]),
      pathOr({}, ['preset', 'sharpFormatSettings', format]),
    ]),
    assoc('id', format)
  )({ size, preset })
);

const toSharp = curryN(3, (preset, format, size) =>
  applySpec({
    resize: computeResizeProps(preset),
    format: computeFormatProps(preset, format),
  })(size)
);

// resize :: pick size props by RESIZE_PROPS, deep merge to defaults set by original image
// toFormat :: pick global format options from preset, pick size specific format options
//             merge together
// should result in: {
//   resize: { width: ..., height: ..., withoutEnlargement: true, ...},
//   format: {id: 'png', ...otherOptions}
// }

module.exports = { prepareFormatList, toSharp };
