const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let html = fs.readFileSync('index.html', 'utf8');
const remaining = [...html.matchAll(/data:image\/([a-zA-Z0-9+]+);base64,([^"'\s>)]+)/g)];

console.log('Remaining base64 images to save locally:', remaining.length);

const publicImagesDir = path.join(__dirname, 'public', 'images');

remaining.forEach((r, i) => {
  const mime = r[1];
  const b64 = r[2];
  const ext = mime.includes('png') ? 'png' : mime.includes('svg') ? 'svg' : 'avif';
  const filename = `extra_asset_${i + 1}.${ext}`;
  const filePath = path.join(publicImagesDir, filename);
  fs.writeFileSync(filePath, Buffer.from(b64, 'base64'));
  console.log(`Saved ${filename} (length ${b64.length})`);

  // Replace this exact data uri with /images/filename
  html = html.split(r[0]).join(`/images/${filename}`);
});

fs.writeFileSync('index.html', html);
console.log('All remaining base64 images converted to local! New size:', html.length, 'bytes');

const finalCheck = [...html.matchAll(/data:image\/[a-zA-Z0-9+]+;base64/g)];
console.log('Final base64 check in index.html:', finalCheck.length);
