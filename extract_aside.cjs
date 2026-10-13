const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('exact_live_body.html', 'utf8');
const $ = cheerio.load(html);

const aside = $('aside');
console.log('aside found:', aside.length);
if (aside.length) {
  fs.writeFileSync('exact_live_aside.html', $.html(aside));
  console.log('Saved exact_live_aside.html');
}
