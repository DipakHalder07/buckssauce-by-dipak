const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-front-fruits]').children().each((i, el) => {
  console.log(`\n=== Fruit ${i} in index.html ===`);
  const canvas = $(el).find('canvas');
  console.log('Canvas count:', canvas.length);
  if (canvas.length) {
    console.log('Canvas style:', canvas.attr('style'));
  }
  const imgs = $(el).find('img');
  console.log('Imgs count:', imgs.length);
  imgs.each((j, img) => {
    console.log(`  Img ${j}: src="${$(img).attr('src')}" style="${$(img).attr('style')}"`);
  });
});
