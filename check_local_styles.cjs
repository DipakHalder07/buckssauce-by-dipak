const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('header style:', $('header').attr('style'));
console.log('logo style:', $('[data-logo]').attr('style'));
console.log('svg style:', $('[data-logo] svg').attr('style'));
console.log('text style:', $('[data-logo] #text').attr('style'));
console.log('global-nav style:', $('[data-global-nav]').attr('style'));
console.log('desktop-nav style:', $('[data-desktop-nav]').attr('style'));
