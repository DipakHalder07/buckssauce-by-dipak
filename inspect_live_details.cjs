const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('exact_live_loader.html', 'utf8');
const $ = cheerio.load(html);

console.log('Loader root classes:', $('div').first().attr('class'));
console.log('Loader root style:', $('div').first().attr('style'));

$('[data-food]').each((i, el) => {
  console.log(`Food ${i}: class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
  console.log('  img:', $(el).find('img').attr('src'), $(el).find('img').attr('class'), $(el).find('img').attr('style'));
});
