const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

// Check style blocks
const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
console.log(`Found ${styleMatches.length} <style> tags.`);
let totalStyleChars = 0;
styleMatches.forEach((s, idx) => {
  totalStyleChars += s.length;
  console.log(`Style ${idx + 1}: length ${s.length}, snippet: ${s.slice(0, 100).replace(/\n/g, ' ')}`);
});

// Extract all base64 images or sf-img variables
const sfImgs = html.match(/--sf-img-\d+:\s*url\([^)]+\)/gi) || [];
console.log(`Found ${sfImgs.length} --sf-img variables`);

// Extract all img src
const imgSrcs = [];
const imgMatches = html.matchAll(/<img[^>]+src=[\"']?([^\"'\s>]+)[\"']?/gi);
for (const m of imgMatches) {
  imgSrcs.push(m[1].slice(0, 80));
}
console.log(`Found ${imgSrcs.length} img tags. Samples:`, imgSrcs.slice(0, 10));

// Check if there are font face definitions
const fontFaces = html.match(/@font-face\s*\{[^}]+\}/gi) || [];
console.log(`Found ${fontFaces.length} @font-face declarations:`, fontFaces.map(f => f.slice(0, 100)));
