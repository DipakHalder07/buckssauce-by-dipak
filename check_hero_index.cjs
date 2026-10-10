const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('Bottle shells in index.html:', $('[data-bottle-shell]').length);
$('[data-bottle-shell]').each((i, el) => {
  console.log(`Shell ${i}: display=${$(el).css('display')} opacity=${$(el).css('opacity')}`);
  const b = $(el).find('[data-bottle]');
  console.log(`  Bottle ${i}: style="${b.attr('style')}"`);
});

console.log('Front fruits in index.html:', $('[data-front-fruits]').children().length);
$('[data-front-fruits]').children().each((i, el) => {
  console.log(`  Front fruit ${i}: style="${$(el).attr('style')}"`);
});

console.log('Back fruits in index.html:', $('[data-back-fruits]').children().length);
$('[data-back-fruits]').children().each((i, el) => {
  console.log(`  Back fruit ${i}: style="${$(el).attr('style')}"`);
});

console.log('Hero arrows in index.html:');
$('[data-slider-arrow]').each((i, el) => {
  const inHero = $(el).closest('[data-home-hero]').length > 0;
  console.log(`  Arrow ${i}: inHero=${inHero} class="${$(el).attr('class')?.substring(0, 40)}"`);
});
