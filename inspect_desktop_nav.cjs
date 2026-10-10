const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const nav = $('[data-desktop-nav]');
console.log('Desktop nav found:', nav.length);
console.log('Desktop nav class:', nav.attr('class'));
console.log('Desktop nav style:', nav.attr('style'));
console.log('Desktop nav parent:', nav.parent().attr('class'));
console.log('Desktop nav children count:', nav.children().length);
nav.children().each((i, el) => {
  console.log(`  child ${i}:`, el.tagName, $(el).attr('class')?.slice(0, 50), 'text:', $(el).text().trim());
});
