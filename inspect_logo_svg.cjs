const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const logo = $('[data-logo] svg');
console.log('Logo SVG:');
console.log($.html(logo));
