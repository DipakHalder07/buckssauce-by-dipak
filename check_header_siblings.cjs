const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('header').parent().children().each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class')?.slice(0, 50), $(el).attr('id'));
});
