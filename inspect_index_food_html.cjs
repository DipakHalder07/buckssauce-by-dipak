const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('#bucks-preloader [data-food]').each((i, food) => {
  console.log(`Food ${i} HTML:\n`, $(food).html().slice(0, 300));
});
