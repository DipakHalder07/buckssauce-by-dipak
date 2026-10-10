const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('#bucks-preloader img').each((i, el) => {
  console.log(`Preloader img ${i}:`);
  console.log('  src:', $(el).attr('src'));
  console.log('  class:', $(el).attr('class'));
});
