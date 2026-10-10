const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('img').each((i, el) => {
  const src = $(el).attr('src') || '';
  if (src.includes('eccbf9df726dd355bf1cfcfdd8d29434') || src.length < 50) {
    console.log(`Small img ${i}:`, src, 'parent:', $(el).parent().prop('tagName'), 'classes:', $(el).attr('class'));
  }
});
