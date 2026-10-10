const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const hero = $('[data-home-hero]');

console.log('=== HERO SHELLS ===');
hero.find('[data-bottle-shell]').each((i, el) => {
  console.log(`Shell ${i}: class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
  const bottle = $(el).find('[data-bottle]');
  console.log(`  Bottle: class="${bottle.attr('class')}" style="${bottle.attr('style')}"`);
  const img = bottle.find('img');
  console.log(`  Img: alt="${img.attr('alt')}" src_len=${img.attr('src')?.length}`);
});

console.log('\n=== FRONT FRUITS ===');
hero.find('[data-front-fruits]').children().each((i, el) => {
  console.log(`Fruit ${i}: tag=${el.tagName} class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
  const img = $(el).find('img');
  console.log(`  Img: alt="${img.attr('alt')}" src_len=${img.attr('src')?.length}`);
});

console.log('\n=== BACK FRUITS ===');
hero.find('[data-back-fruits]').children().each((i, el) => {
  console.log(`Fruit ${i}: tag=${el.tagName} class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
  const img = $(el).find('img');
  console.log(`  Img: alt="${img.attr('alt')}" src_len=${img.attr('src')?.length}`);
});

console.log('\n=== TICKERS ===');
console.log('Numbers container style:', hero.find('[data-product-numbers]').attr('style'));
hero.find('[data-product-number]').each((i, el) => {
  console.log(`  Num ${i}: text="${$(el).text()}" style="${$(el).attr('style')}" class="${$(el).attr('class')}"`);
});

console.log('Names container style:', hero.find('[data-product-names]').attr('style'));
hero.find('[data-product-name]').each((i, el) => {
  console.log(`  Name ${i}: text="${$(el).text()}" style="${$(el).attr('style')}" class="${$(el).attr('class')}"`);
});

console.log('\n=== BG CIRCLE ===');
console.log('Circle outer class:', hero.find('[data-bg-circle]').attr('class'), 'style:', hero.find('[data-bg-circle]').attr('style'));
console.log('Circle inner class:', hero.find('[data-bg-circle-inner]').attr('class'), 'style:', hero.find('[data-bg-circle-inner]').attr('style'));

console.log('\n=== BOTTOM BAR / CTA ===');
console.log('Bottom bar HTML:', hero.find('[data-bottom-bar]').html());
