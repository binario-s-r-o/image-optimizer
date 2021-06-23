const {
  curryN,
  pipe,
  map,
  append,
  sort,
  join,
  filter,
  pathSatisfies,
  gt,
  propOr,
  applySpec,
} = require('ramda');
const { identity } = require('rxjs');

const buildVariantStr = curryN(
  3,
  (file, format, size) =>
    `${file.dirname}/${file.basename}${size.suffix}.${format} ${size.width}w`
);

const appendOriginal = curryN(3, (file, format, sizes) =>
  append(`${file.dirname}/${file.basename}.${format}`, sizes)
);

const createSrcSet = curryN(3, (file, sizes, format) =>
  pipe(
    sort((a, b) => a.width - b.width),
    map(buildVariantStr(file, format)),
    appendOriginal(file, format),
    join(', ')
  )(sizes)
);

const filterRelevantSizes = curryN(2, (meta, sizes) =>
  filter(pathSatisfies(gt(meta.width), ['width']))(sizes)
);

const createManifestSource = curryN(3, (file, sizes, format) =>
  applySpec({ mime: (f) => `image/${f}`, srcset: createSrcSet(file, sizes) })(
    format
  )
);

const createManifestSourceList = curryN(3, (file, formats, sizes) =>
  map(createManifestSource(file, sizes))(formats)
);

const createManifestEntry = curryN(3, (preset, file, meta) =>
  pipe(
    propOr([], 'sizes'),
    filterRelevantSizes(meta),
    createManifestSourceList(file, preset.extraFormats),
    applySpec({ sources: identity })
  )(preset)
);

module.exports = {
  createSrcSet,
  filterRelevantSizes,
  createManifestEntry,
  createManifestSource,
};
