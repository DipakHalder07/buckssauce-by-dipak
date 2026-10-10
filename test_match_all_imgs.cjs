const fs = require('fs');
const crypto = require('crypto');
const manifest = JSON.parse(fs.readFileSync('tools/images_manifest.json', 'utf8'));

const html = fs.readFileSync('index.html', 'utf8');

const imgRegex = /<img\s+([^>]+)>/gi;
let m;
let total = 0;
let matched = 0;
let unmatched = 0;

while ((m = imgRegex.exec(html)) !== null) {
  total++;
  const srcM = m[1].match(/src=["']?(data:image\/[^"'\s>]+)["']?/i);
  if (srcM) {
    const b64 = srcM[1].split(',')[1];
    if (b64) {
      const hash = crypto.createHash('md5').update(b64).digest('hex');
      const found = manifest.images.find(img => img.hash === hash);
      if (found) {
        matched++;
      } else {
        unmatched++;
        console.log(`Unmatched img #${total}: hash ${hash}, b64 len ${b64.length}`);
      }
    }
  }
}

console.log(`Total imgs: ${total}, Matched: ${matched}, Unmatched: ${unmatched}`);
