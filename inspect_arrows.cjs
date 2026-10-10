const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('[data-slider-arrow]').slice(0, 2).each((i, el) => {
  console.log(`Arrow ${i}:`, $.html(el));
});
