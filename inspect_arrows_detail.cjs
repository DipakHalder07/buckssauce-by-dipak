const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-slider-arrow]').each((i, el) => {
  console.log(`Arrow ${i}: tagName=${el.tagName} href=${$(el).attr('href')} parent=${el.parent.tagName} outerHTML=${$.html(el).substring(0, 100)}`);
});
