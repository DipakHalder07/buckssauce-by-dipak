const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const menu = $('[data-menu]');
console.log('Menu inner HTML (first 500 chars):');
console.log(menu.html().substring(0, 500));
console.log('\nMenu items count:', menu.find('a, [data-menu-items]').length);
menu.find('a').each((i, el) => {
  console.log(`Menu link ${i}: text="${$(el).text().trim()}" style="${$(el).attr('style')}" class="${$(el).attr('class')}"`);
});
