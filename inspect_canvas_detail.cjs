const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('[data-front-fruits] [data-fruit]').each((i, el) => {
  console.log(`\n=== Fruit ${i} Classes and Attributes ===`);
  console.log('fruit class:', $(el).attr('class'));
  console.log('fruit style:', $(el).attr('style'));
  const canvas = $(el).find('canvas');
  console.log('canvas found:', canvas.length);
  if (canvas.length) {
    console.log('canvas parent class:', canvas.parent().attr('class'));
    console.log('canvas grand-parent class:', canvas.parent().parent().attr('class'));
    console.log('canvas style:', canvas.attr('style'));
    console.log('canvas width:', canvas.attr('width'), 'height:', canvas.attr('height'));
    console.log('canvas container HTML:', canvas.parent().parent().parent().parent().prop('outerHTML'));
  }
});
