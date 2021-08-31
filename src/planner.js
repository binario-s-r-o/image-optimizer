const {
  pipe,
  curryN,
  propOr,
  filter,
  pathSatisfies,
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
  T,
  nthArg,
  pickBy,
  flip,
  mergeDeepLeft,
  assoc,
  over,
  lensPath,
  gt,
  defaultTo,
  mergeDeepRight,
  __,
} = require('ramda');

const DEFAULT_PRESET = require('./defaultPreset');

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

const extractSizeResizeProps = pickBy(
  pipe(nthArg(1), flip(includes)(RESIZE_PROPS))
);

const computeResizeProps = curryN(2, (preset, size) =>
  pipe(
    applySpec({
      width: pathOr(DEFAULT_PRESET.original.maxWidth, ['original', 'maxWidth']),
      height: pathOr(DEFAULT_PRESET.original.maxHeight, [
        'original',
        'maxHeight',
      ]),
      withoutEnlargement: T,
      fit: always('inside'),
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
    assoc('options', __, {}),
    assoc('id', format)
  )({ size, preset })
);

const createSizeSharpConfig = curryN(3, (preset, format, size) =>
  applySpec({
    resize: computeResizeProps(preset),
    format: computeFormatProps(preset, format),
  })(size)
);

const sizeSharpConfigMapper = curryN(3, (preset, format, size) =>
  converge(assoc('sharp'), [createSizeSharpConfig(preset, format), identity])(
    size
  )
);

const sharpConfigFormatListMapper = curryN(2, (preset, item) =>
  over(
    lensPath(['sizes']),
    map(sizeSharpConfigMapper(preset, item.format))
  )(item)
);

const prepareSizes = curryN(2, (preset, meta) =>
  pipe(
    propOr([], 'sizes'),
    filter(pathSatisfies(gt(meta.width), ['width'])),
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

const prepareFormatListSafe = curryN(2, (meta, preset) =>
  pipe(
    prepareSizes(preset),
    converge(append, [
      prepareOriginalFormat(preset, meta),
      prepareExtraFormats(preset),
    ]),
    map(sharpConfigFormatListMapper(preset))
  )(meta)
);

const prepareFormatList = curryN(2, (preset, meta) =>
  pipe(
    defaultTo({}),
    mergeDeepRight(DEFAULT_PRESET),
    prepareFormatListSafe(meta)
  )(preset)
);

module.exports = { prepareFormatList };
