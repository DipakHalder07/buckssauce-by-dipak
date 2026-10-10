const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('#bucks-preloader [data-food]').each((i, el) => {
  console.log(i, $(el).attr('class'));
  console.log('  img:', $(el).find('img').attr('src'));
});
