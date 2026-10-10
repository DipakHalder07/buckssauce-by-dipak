const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-slider-arrow]').each((i, el) => {
  const inHero = $(el).closest('[data-home-hero]').length;
  const inSection0 = $(el).closest('section').attr('data-home-hero');
  console.log(`Arrow ${i}: inHero=${inHero} sectionAttr=${inSection0}`);
});
