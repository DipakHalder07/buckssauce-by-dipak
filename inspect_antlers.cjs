const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- data-left-antler and data-right-antler ---');
$('[data-left-antler], [data-right-antler]').each((i, el) => {
  console.log(`Antler ${i}: tag=${el.tagName} class="${$(el).attr('class')}" id="${$(el).attr('id')}" data="${Object.keys(el.attribs || {}).filter(k => k.startsWith('data-')).join(' ')}" style="${$(el).attr('style')}"`);
});
