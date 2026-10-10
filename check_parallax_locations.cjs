const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-parallax-food]').each((i, el) => {
  const sec = $(el).closest('section');
  const secIdx = $('section').index(sec);
  console.log(`Food ${i}: Section ${secIdx}, speed: ${$(el).attr('data-parallax-speed')}, innerImg: ${$(el).find('img').attr('alt') || $(el).find('img').length}`);
});
