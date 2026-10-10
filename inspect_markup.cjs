const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_header.html', 'utf8'));

console.log('header tag:', $('header').attr('class'));
console.log('first div:', $('header > div').first().attr('class'));
console.log('logo a:', $('[data-logo]').attr('class'));
console.log('desktop nav:', $('[data-desktop-nav]').attr('class'));
console.log('global nav:', $('[data-global-nav]').attr('class'));
console.log('cart button:', $('[data-cart-button]').attr('class'));
console.log('hamburger:', $('[data-hamburger]').attr('class'));
