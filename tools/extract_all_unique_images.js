const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const html = fs.readFileSync('home.html', 'utf8');
const assetsDir = path.join(__dirname, 'public', 'images');

// Clean directory
const existingFiles = fs.readdirSync(assetsDir);
for (const f of existingFiles) {
  fs.unlinkSync(path.join(assetsDir, f));
}

const hashMap = new Map();
let counter = 0;

function saveBase64(dataUri, hint = '') {
  const match = dataUri.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const b64 = match[2];
  const hash = crypto.createHash('md5').update(b64).digest('hex');

  if (hashMap.has(hash)) {
    return hashMap.get(hash);
  }

  counter++;
  let ext = mime;
  if (mime === 'svg+xml') ext = 'svg';
  else if (mime === 'jpeg') ext = 'jpg';
  else if (mime === 'png') ext = 'png';
  else if (mime === 'webp') ext = 'webp';
  else if (mime === 'avif') ext = 'avif';

  const cleanHint = hint ? '_' + hint.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30) : '';
  const filename = `img_${counter}${cleanHint}.${ext}`;
  const filePath = path.join(assetsDir, filename);

  const buffer = Buffer.from(b64, 'base64');
  fs.writeFileSync(filePath, buffer);

  const meta = {
    id: counter,
    filename,
    path: `/images/${filename}`,
    mime,
    size: buffer.length,
    hash
  };

  hashMap.set(hash, meta);
  return meta;
}

// 1. Scan all <img> tags
const imgRegex = /<img\s+([^>]+)>/gi;
let m;
const imgUsage = [];

while ((m = imgRegex.exec(html)) !== null) {
  const attrs = m[1];
  const srcM = attrs.match(/src=["']?(data:image\/[^"'\s>]+)["']?/i);
  const altM = attrs.match(/alt=["']?([^"'>]*)["']?/i);
  const wM = attrs.match(/width=["']?(\d+)["']?/i);
  const hM = attrs.match(/height=["']?(\d+)["']?/i);

  // find surrounding text or classes
  const before = html.substring(Math.max(0, m.index - 200), m.index);
  let hint = (altM && altM[1]) ? altM[1] : '';
  if (!hint && before.includes('data-bottle')) hint = 'bottle';
  else if (!hint && before.includes('data-fruit')) hint = 'fruit';
  else if (!hint && before.includes('data-review')) hint = 'review';
  else if (!hint && before.includes('data-card')) hint = 'card';

  if (srcM) {
    const meta = saveBase64(srcM[1], hint);
    if (meta) {
      imgUsage.push({
        imgIndex: imgUsage.length + 1,
        savedFile: meta.filename,
        w: wM ? wM[1] : '',
        h: hM ? hM[1] : '',
        alt: altM ? altM[1] : '',
        hint
      });
    }
  }
}

// 2. Scan all CSS url("data:image/...")
const cssRegex = /url\(["']?(data:image\/[^"')]+)["']?\)/gi;
let cssM;
while ((cssM = cssRegex.exec(html)) !== null) {
  saveBase64(cssM[1], 'bg');
}

console.log(`Successfully extracted ${hashMap.size} unique images!`);
fs.writeFileSync('images_manifest.json', JSON.stringify({
  count: hashMap.size,
  images: Array.from(hashMap.values()),
  usage: imgUsage
}, null, 2));

