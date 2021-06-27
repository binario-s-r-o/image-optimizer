const {
  applySpec,
  path,
  pipe,
  groupBy,
  toPairs,
  map,
  over,
  lensIndex,
  fromPairs,
  reduce,
  nth,
  defaultTo,
  lensProp,
  append,
  prop,
  sort,
  converge,
  subtract,
  binary,
  nthArg,
  pathOr,
  ifElse,
  pathSatisfies,
  isNil,
  unapply,
  join,
  assoc,
  identity,
  concat,
  flip,
  toString,
} = require('ramda');

const extractFragment = applySpec({
  hwRatio: path(['manifest', 'hwRatio']),
  width: path(['manifest', 'width']),
  format: path(['manifest', 'format']),
  variantRelativePath: path(['manifest', 'variantRelativePath']),
  originalRelativePath: path(['manifest', 'originalRelativePath']),
});

const toFormatSize = applySpec({
  path: prop('variantRelativePath'),
  width: prop('width'),
});

const sortBySize = sort(
  converge(subtract, [
    binary(pipe(nthArg(0), pathOr(Number.POSITIVE_INFINITY, ['width']))),
    binary(pipe(nthArg(1), pathOr(Number.POSITIVE_INFINITY, ['width']))),
  ])
);

const srcsetMapper = ifElse(
  pathSatisfies(isNil, ['width']),
  prop('path'),
  converge(unapply(join(' ')), [
    prop('path'),
    pipe(prop('width'), toString, flip(concat)('w')),
  ])
);

const createFormatSrcset = converge(assoc('srcset'), [
  pipe(prop('sizes'), sortBySize, map(srcsetMapper), join(', ')),
  identity,
]);

const formatReducer = (acc, current) =>
  pipe(
    defaultTo({}),
    over(lensProp('sizes'), pipe(defaultTo([]), append(toFormatSize(current)))),
    over(lensProp('format'), defaultTo(current.format)),
    over(lensProp('mime'), defaultTo(`image/${current.format}`))
  )(acc);

const extractFormatHwRatio = path([0, 'hwRatio']);

const t1Transform = (orig) =>
  pipe(
    groupBy(path(['format'])),
    toPairs,
    map(pipe(nth(1), pipe(reduce(formatReducer, {})), createFormatSrcset)),
    flip(assoc('sources'))({}),
    assoc('hw_ratio', extractFormatHwRatio(orig))
  )(orig);

const fragmentsToManifest = pipe(
  groupBy(path(['originalRelativePath'])),
  toPairs,
  map(over(lensIndex(1), t1Transform)),
  fromPairs
);

module.exports = {
  extractFragment,
  fragmentsToManifest,
};
