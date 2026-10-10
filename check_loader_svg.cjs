const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_loader.html', 'utf8'));

const svg = $('svg').first();
console.log('SVG viewBox:', svg.attr('viewBox'));
console.log('SVG children count:', svg.children().length);
console.log('SVG path count:', svg.find('path').length);
console.log('SVG length:', svg.html().length);
