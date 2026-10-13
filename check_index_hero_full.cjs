const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const hero = $('[data-home-hero]');

console.log('=== BOTTLE SHELLS ===');
hero.find('[data-bottle-shell]').each((i, el) => {
  const img = $(el).find('img');
  console.log(`Bottle ${i}: img src="${img.attr('src')}" class="${img.attr('class')}"`);
});

console.log('\n=== FRONT FRUITS ===');
hero.find('[data-front-fruits]').children().each((i, el) => {
  const img = $(el).find('img');
  const canvas = $(el).find('canvas');
  console.log(`Front Fruit ${i}:`);
  console.log('  container class:', $(el).attr('class'));
  console.log('  img src:', img.attr('src'));
  console.log('  canvas count:', canvas.length, 'style:', canvas.attr('style'));
});

console.log('\n=== BACK FRUITS ===');
hero.find('[data-back-fruits]').children().each((i, el) => {
  const img = $(el).find('img');
  console.log(`Back Fruit ${i}:`);
  console.log('  container class:', $(el).attr('class'));
  console.log('  img src:', img.attr('src'));
});
