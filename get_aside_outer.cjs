const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_body.html', 'utf8'));
const aside = $('div.relative > aside');
console.log('aside count:', aside.length);
if (aside.length) {
  console.log(aside.prop('outerHTML'));
}
