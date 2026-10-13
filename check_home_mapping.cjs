const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

console.log('=== HOME.HTML HERO BOTTLES ===');
$('[data-home-hero] [data-bottle-shell]').each((i, el) => {
  const bottle = $(el).find('[data-bottle]');
  const img = $(el).find('img');
  console.log(`Bottle Shell ${i}: style="${$(el).attr('style')}" bottleStyle="${bottle.attr('style')}"`);
});

console.log('=== HOME.HTML HERO NUMBERS & NAMES ===');
$('[data-product-number]').each((i, el) => {
  console.log(`Number ${i}: "${$(el).text()}" style="${$(el).attr('style')}"`);
});
$('[data-product-name]').each((i, el) => {
  console.log(`Name ${i}: "${$(el).text()}" style="${$(el).attr('style')}"`);
});
