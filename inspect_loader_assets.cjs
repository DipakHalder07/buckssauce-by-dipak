const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_loader.html', 'utf8'));

$('img').each((i, img) => {
  console.log(`Img ${i}:`, $(img).attr('src'));
});

const svg = $('svg');
console.log('SVG found:', svg.length);
console.log('SVG class:', svg.attr('class'));
console.log('SVG viewBox:', svg.attr('viewBox'));
console.log('SVG width:', svg.attr('width'), 'height:', svg.attr('height'));
