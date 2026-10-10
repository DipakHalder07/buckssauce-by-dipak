const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-listing-card]').each((i, card) => {
  const left = $(card).find('[data-left-antler]');
  const right = $(card).find('[data-right-antler]');
  console.log(`Card ${i}: hasLeft=${left.length} hasRight=${right.length} leftStyle="${left.attr('style')}"`);
});
