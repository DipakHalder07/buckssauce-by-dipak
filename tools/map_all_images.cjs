const fs = require('fs');
const crypto = require('crypto');
const manifest = JSON.parse(fs.readFileSync('images_manifest.json', 'utf8'));

for (let s = 1; s <= 6; s++) {
  const part = fs.readFileSync(`part_section_${s}.html`, 'utf8');
  console.log(`\n=== SECTION ${s} ===`);
  const imgRegex = /<img\s+([^>]+)>/gi;
  let m;
  let count = 0;
  while ((m = imgRegex.exec(part)) !== null) {
    count++;
    const srcM = m[1].match(/src=["']?(data:image\/[^"'\s>]+)["']?/i);
    const altM = m[1].match(/alt=["']?([^"'>]*)["']?/i);
    if (srcM) {
      const b64 = srcM[1].split(',')[1];
      const hash = crypto.createHash('md5').update(b64).digest('hex');
      const found = manifest.images.find(img => img.hash === hash);
      console.log(`Sec ${s} #${count}: ${found ? found.filename : 'inline/svg'} | alt: ${altM ? altM[1] : ''}`);
    }
  }
}
