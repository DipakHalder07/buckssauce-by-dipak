const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('[class*="animate-"]').each((i, el) => {
  console.log(`Animated el ${i}: class="${$(el).attr('class')}" parent=${el.parent.tagName}`);
});
