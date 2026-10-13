const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('exact_live_body.html', 'utf8');
const $ = cheerio.load(html);

const root = $('div.relative').first();
root.children().each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class')?.slice(0, 80), 'style:', $(el).attr('style')?.slice(0, 80));
});
