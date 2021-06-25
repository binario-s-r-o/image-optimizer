const fs = require('fs');
const sharp = require('sharp');

const preset = require('./sample/image-presets');
const { prepareFormatList } = require('./src/planner');

const buf = fs.readFileSync(`${__dirname}/sample/img/black-arrow.svg`);

sharp(buf)
  .metadata()
  .then((meta) => {
    console.log(meta);
    const fl = prepareFormatList(preset, meta);

    // console.log(JSON.stringify(fl, null, 2));
  });
