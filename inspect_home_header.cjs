const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

console.log('--- Home.html header ---');
console.log($('header').attr('class'));
console.log($('header').attr('style'));
console.log($('header').attr('data-nav'));
console.log('Header inner text:', $('header').text().trim().replace(/\s+/g, ' ').slice(0, 150));
