const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('#bucks-preloader img').each((i, el) => {
  const src = $(el).attr('src') || '';
  console.log(`Img ${i} src start: ${src.slice(0, 60)} length: ${src.length}`);
});
