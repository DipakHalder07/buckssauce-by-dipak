const fs = require('fs');
const crypto = require('crypto');
const manifest = JSON.parse(fs.readFileSync('tools/images_manifest.json', 'utf8'));

const html = fs.readFileSync('index.html', 'utf8');

// Find all video posters
const posterRegex = /poster=["'](data:image\/[^"']+)["']/g;
let m;
let count = 0;
while ((m = posterRegex.exec(html)) !== null) {
  count++;
  const b64 = m[1].split(',')[1];
  const hash = crypto.createHash('md5').update(b64).digest('hex');
  const found = manifest.images.find(img => img.hash === hash);
  console.log(`Poster #${count}: len ${b64.length}, hash: ${hash}, found: ${found ? found.filename : 'none'}`);
}
