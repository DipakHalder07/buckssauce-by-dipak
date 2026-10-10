const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const logo = $('[data-logo]');
console.log('has logo:', logo.length);
console.log('has svg:', logo.find('svg').length);
console.log('has #head:', logo.find('#head').length);
console.log('has #text:', logo.find('#text').length);
console.log('has #left-horn:', logo.find('#left-horn').length);
console.log('has #right-horn:', logo.find('#right-horn').length);
