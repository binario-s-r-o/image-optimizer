const fs = require('fs');
const sharp = require('sharp');

const preset = require('./sample/image-presets');
const { toSharp, prepareFormatList } = require('./src/planner');

const buf = fs.readFileSync(`${__dirname}/sample/about-us.jpg`);

sharp(buf)
  .metadata()
  .then((meta) => {
    const fl = prepareFormatList(preset, meta);
    console.log(JSON.stringify(fl, null, 2));
  });
