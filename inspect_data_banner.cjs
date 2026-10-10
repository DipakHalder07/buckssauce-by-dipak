const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const banner = $('[data-banner]');
console.log('Banner length:', banner.length);
console.log('Banner outerHTML:', banner.prop('outerHTML'));
