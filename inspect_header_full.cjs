const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- Header inspection ---');
$('header').each((i, el) => {
  console.log(`Header ${i}: class="${$(el).attr('class')}" style="${$(el).attr('style')}" data="${Object.keys(el.attribs || {}).filter(k => k.startsWith('data-')).join(' ')}"`);
  console.log('Header children count:', $(el).children().length);
  $(el).children().each((j, child) => {
    console.log(`  Child ${j}: tag=${child.tagName} class="${$(child).attr('class')}" data="${Object.keys(child.attribs || {}).filter(k => k.startsWith('data-')).join(' ')}" style="${$(child).attr('style')}"`);
  });
});
