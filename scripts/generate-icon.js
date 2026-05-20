const sharp = require('sharp');
const path = require('path');

const src = path.join(__dirname, '../public/icon.svg');
const out = path.join(__dirname, '../public/icon.png');

sharp(src)
  .resize(512, 512)
  .png()
  .toFile(out)
  .then(() => console.log('Generated public/icon.png'))
  .catch(err => { console.error(err); process.exit(1); });
