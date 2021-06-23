const sharp = require('sharp');
const {
  invoker,
  pipe,
  prop,
  map,
  applySpec,
  path,
  always,
  T,
} = require('ramda');

const baseResizeOptions = applySpec({
  height: path(['original', 'maxHeight']),
  width: path(['original', 'maxWidth']),
  fit: always('contain'),
  withoutEnlargement: T,
});

const resize = invoker(1, 'resize');
const toFormat = invoker(1, 'toFormat');
const toBuffer = invoker(0, 'toBuffer');

const processFile = pipe(prop('formatList'), map());
