const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('Circles in #bucks-preloader:', $('#bucks-preloader [data-circle]').length);
$('#bucks-preloader [data-circle]').each((i, el) => {
  console.log(`Circle ${i}:`, el.attribs);
});

console.log('Total [data-circle-gold] in whole doc:', $('[data-circle-gold]').length);
