const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const mi = $('[data-menu-items]');
console.log('data-menu-items class:', mi.attr('class'), 'style:', mi.attr('style'));
console.log('data-menu-items children count:', mi.children().length);
mi.children().each((i, el) => {
  console.log(`Child ${i}: tag=${el.tagName} class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
});
