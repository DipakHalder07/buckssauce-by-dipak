const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('exact_live_body.html', 'utf8');
const $ = cheerio.load(html);

console.log('Body first few elements:');
$('body').children().slice(0, 5).each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class')?.slice(0, 80), 'style:', $(el).attr('style')?.slice(0, 80));
});
