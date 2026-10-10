const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
console.log('Title:', title ? title[1] : 'None');

const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
console.log('Headings count:', headings.length);
headings.forEach((h, i) => {
  console.log(`H${i+1}:`, h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
});

// Look for data- attributes or identifiers that give away components
const dataAttrs = new Set();
const matches = html.matchAll(/data-[a-z0-9-]+/gi);
for (const m of matches) {
  dataAttrs.add(m[0]);
}
console.log('Data attributes:', Array.from(dataAttrs));

// Check fonts mentioned
const fonts = new Set();
const fontMatches = html.matchAll(/--font-[a-z0-9-]+:[^;]+;/gi);
for (const m of fontMatches) {
  fonts.add(m[0]);
}
console.log('Fonts:', Array.from(fonts));

// Let's find images
const imgMatches = html.matchAll(/<img[^>]+>/gi);
let imgCount = 0;
const sampleImgs = [];
for (const m of imgMatches) {
  imgCount++;
  if (imgCount <= 10) sampleImgs.push(m[0].slice(0, 150));
}
console.log(`Images count: ${imgCount}`);
console.log('Sample images:', sampleImgs);
