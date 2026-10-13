const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

$('#bucks-preloader [data-food]').each((i, el) => {
  console.log('Food', i, 'HTML:');
  console.log($(el).html());
});
