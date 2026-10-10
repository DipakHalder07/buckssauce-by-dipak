const fs = require('fs');
const crypto = require('crypto');
const manifest = JSON.parse(fs.readFileSync('tools/images_manifest.json', 'utf8'));

let html = fs.readFileSync('index.html', 'utf8');
console.log('Original index.html size:', html.length, 'bytes');

// 1. Replace CSS background variable --sf-img-17
html = html.replace(/--sf-img-17:\s*url\("[^"]+"\)/g, '--sf-img-17: url("/images/img_17.avif")');

// 2. Map all base64 <img> tags to local images
let replacedCount = 0;
html = html.replace(/<img\s+([^>]*?)src=["'](data:image\/[^"'\s>]+)["']([^>]*?)>/gi, (match, prefix, src, suffix) => {
  const parts = src.split(',');
  if (parts.length < 2) return match;
  const b64 = parts[1];
  const hash = crypto.createHash('md5').update(b64).digest('hex');
  const found = manifest.images.find(img => img.hash === hash);
  if (found) {
    replacedCount++;
    return `<img ${prefix}src="/images/${found.filename}"${suffix}>`;
  }
  return match;
});

console.log(`Replaced ${replacedCount} base64 images with local /images/... paths!`);
console.log('New index.html size:', html.length, 'bytes');

// Check if any base64 remains
const remaining = [...html.matchAll(/data:image\/[^"'\s>]+/g)];
console.log('Remaining data:image occurrences:', remaining.length);
remaining.forEach((m, i) => console.log(`Remaining #${i}: len ${m[0].length}, preview: ${m[0].slice(0, 50)}`));
