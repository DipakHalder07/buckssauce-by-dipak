const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- HERO SECTION FOOD ITEMS IN INDEX.HTML ---');
$('[data-home-hero] [data-parallax-food]').each((i, el) => {
  console.log(`Hero Food ${i}:`);
  console.log('parent class:', $(el).parent().attr('class'));
  console.log('class:', $(el).attr('class'));
  console.log('style:', $(el).attr('style'));
  const img = $(el).find('img');
  console.log('img src:', img.attr('src'));
  console.log('img class:', img.attr('class'));
  console.log('img width/height:', img.attr('width'), img.attr('height'));
});
