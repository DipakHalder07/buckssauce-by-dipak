const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- Logo SVG / img ---');
$('[data-logo]').each((i, el) => {
  console.log('Logo:', el.tagName, $(el).html()?.substring(0, 100));
});

console.log('\n--- Hero fruit images ---');
$('[data-front-fruits] img, [data-back-fruits] img').each((i, el) => {
  console.log(`Fruit img ${i}: alt="${$(el).attr('alt')}" src_preview="${$(el).attr('src')?.substring(0, 60)}"`);
});
