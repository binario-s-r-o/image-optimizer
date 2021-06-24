const sharp = require('sharp');
const { invoker, pipe, curryN } = require('ramda');
const { defer } = require('rxjs');

const resize = invoker(1, 'resize');
const toFormat = invoker(1, 'toFormat');
const toBuffer = invoker(0, 'toBuffer');

const processFile$ = curryN(2, (buf, sharpConf) =>
  defer(() =>
    pipe(
      sharp,
      resize(sharpConf.resize),
      toFormat(sharpConf.format),
      toBuffer
    )(buf)
  )
);

const getImageMetaP = (img) => sharp(img).metadata();

module.exports = { processFile$, getImageMetaP };
