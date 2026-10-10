const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const manifest = JSON.parse(fs.readFileSync('tools/images_manifest.json', 'utf8'));
let html = fs.readFileSync('index.html', 'utf8');

const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

console.log('1. Saving 6 video posters to public/images/ ...');
const posterRegex = /poster=["'](data:image\/([a-zA-Z0-9+]+);base64,([^"']+))["']/g;
const posterMap = new Map();
let pIndex = 1;
let match;

while ((match = posterRegex.exec(html)) !== null) {
  const mime = match[2];
  const b64 = match[3];
  const hash = crypto.createHash('md5').update(b64).digest('hex');
  if (!posterMap.has(hash)) {
    const filename = `video_poster_${pIndex}.${mime === 'avif' ? 'avif' : 'webp'}`;
    const filePath = path.join(publicImagesDir, filename);
    fs.writeFileSync(filePath, Buffer.from(b64, 'base64'));
    posterMap.set(hash, `/images/${filename}`);
    console.log(`Saved ${filename} (${b64.length} chars)`);
    pIndex++;
  }
}

// 2. Extract tiny instagram icon (Match #59, etc.)
const smallIconRegex = /<img[^>]*src=["'](data:image\/png;base64,([^"']+))["'][^>]*style="[^"]*width:16px/g;
while ((match = smallIconRegex.exec(html)) !== null) {
  const b64 = match[2];
  const hash = crypto.createHash('md5').update(b64).digest('hex');
  if (!posterMap.has(hash)) {
    const filename = 'instagram_icon_16.png';
    const filePath = path.join(publicImagesDir, filename);
    fs.writeFileSync(filePath, Buffer.from(b64, 'base64'));
    posterMap.set(hash, `/images/${filename}`);
    console.log(`Saved ${filename}`);
  }
}

// 3. Map background images (img_46_bg to img_50_bg)
const bgMap = {
  12970: '/images/img_46_bg.png',
  18934: '/images/img_47_bg.png',
  22374: '/images/img_48_bg.png',
  20714: '/images/img_49_bg.png',
  20350: '/images/img_50_bg.png'
};

// 4. Perform replacements in HTML
// a) Replace --sf-img-17
html = html.replace(/--sf-img-17:\s*url\("[^"]+"\)/g, '--sf-img-17: url("/images/img_17.avif")');

// b) Replace video posters
html = html.replace(/poster=["']data:image\/[a-zA-Z0-9+]+;base64,([^"']+)["']/g, (m, b64) => {
  const hash = crypto.createHash('md5').update(b64).digest('hex');
  if (posterMap.has(hash)) {
    return `poster="${posterMap.get(hash)}"`;
  }
  return m;
});

// c) Replace background images in inline styles
html = html.replace(/url\((data:image\/png;base64,([^)]+))\)/g, (m, fullData, b64) => {
  const len = b64.length;
  if (bgMap[len]) {
    return `url("${bgMap[len]}")`;
  }
  const hash = crypto.createHash('md5').update(b64).digest('hex');
  const found = manifest.images.find(img => img.hash === hash);
  if (found) {
    return `url("/images/${found.filename}")`;
  }
  return m;
});

// d) Replace all img tags with data:image/
let replacedImgCount = 0;
html = html.replace(/<img\s+([^>]*?)src=["'](data:image\/[^"'\s>]+)["']([^>]*?)>/gi, (m, prefix, src, suffix) => {
  if (src.startsWith('data:image/svg+xml')) return m; // keep 1x1 transparent svg
  const parts = src.split(',');
  if (parts.length < 2) return m;
  const b64 = parts[1];
  const hash = crypto.createHash('md5').update(b64).digest('hex');
  if (posterMap.has(hash)) {
    replacedImgCount++;
    return `<img ${prefix}src="${posterMap.get(hash)}"${suffix}>`;
  }
  const found = manifest.images.find(img => img.hash === hash);
  if (found) {
    replacedImgCount++;
    return `<img ${prefix}src="/images/${found.filename}"${suffix}>`;
  }
  return m;
});

console.log(`Replaced ${replacedImgCount} <img> tags.`);

// 5. Check remaining data:image occurrences
const remaining = [...html.matchAll(/data:image\/[^"'\s>)]+/g)];
console.log('Remaining data:image occurrences in html:', remaining.length);
remaining.forEach((r, idx) => console.log(`Remaining #${idx}: len ${r[0].length}`));

fs.writeFileSync('index.html', html);
console.log('Successfully updated index.html! New size:', html.length, 'bytes');
