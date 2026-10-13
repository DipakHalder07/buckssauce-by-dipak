const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_body.html', 'utf8'));
console.log('aside in exact_live_body:', $('aside').length);
console.log('aside HTML:\n', $('aside').parent().html()?.slice(0, 1000));
