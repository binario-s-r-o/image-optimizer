const { pipe, pathOr, curryN, converge, or, prop, propOr } = require("ramda");

const filterRelevantSizes = curryN(2, (meta, size) =>
  converge(or, [
    pipe(prop("width"), lt(propOr(Number.POSITIVE_INFINITY, "width", size))),
    pipe(prop("height"), lt(propOr(Number.POSITIVE_INFINITY, "height", size))),
  ])(meta)
);

const getRelevantSizes = (preset, meta) =>
  pipe(pathOr([], ["sizes"]), filter(filterRelevantSizes(meta)))(preset);
