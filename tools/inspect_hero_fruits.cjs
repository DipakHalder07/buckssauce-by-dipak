const fs = require('fs');

const sec1 = fs.readFileSync('part_section_1.html', 'utf8');

// find all img in section 1 with their class, alt, width, height, and src md5
const crypto = require('crypto');
const manifest = JSON.parse(fs.readFileSync('images_manifest.json', 'utf8'));

const imgRegex = /<img\s+([^>]+)>/gi;
let m;
let i = 0;
while ((m = imgRegex.exec(sec1)) !== null) {
  i++;
  const srcM = m[1].match(/src=["']?(data:image\/[^"'\s>]+)["']?/i);
  if (srcM) {
    const b64 = srcM[1].split(',')[1];
    const hash = crypto.createHash('md5').update(b64).digest('hex');
    const found = manifest.images.find(img => img.hash === hash);
    console.log(`Hero Img #${i}: ${found ? found.filename : 'unknown'} (${found ? found.mime : ''})`);
  }
}
