const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('section').each((i, el) => {
  console.log(`Section ${i}: style="${$(el).attr('style')}"`);
});

console.log('\n--- Elements with pin-spacer or fixed/absolute transforms ---');
$('*').each((i, el) => {
  const cls = $(el).attr('class') || '';
  if (cls.includes('pin-spacer')) {
    console.log(`Pin spacer found: tag=${el.tagName} class="${cls}" style="${$(el).attr('style')}"`);
  }
});
