const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-listing-card]').each((i, card) => {
  const left = $(card).find('[data-left-antler]');
  const right = $(card).find('[data-right-antler]');
  console.log(`Card ${i}:`);
  console.log('  left tag:', left[0]?.tagName, 'style:', left.attr('style'), 'class:', left.attr('class'));
  console.log('  right tag:', right[0]?.tagName, 'style:', right.attr('style'), 'class:', right.attr('class'));
  console.log('  bottle img:', $(card).find('img[data-listing-image], img[alt*="bottle"], img').attr('alt'));
});
