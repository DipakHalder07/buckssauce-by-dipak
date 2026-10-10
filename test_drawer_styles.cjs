const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));
const cart = $('[data-cart]');
const menu = $('[data-menu]');
console.log('Cart style:', cart.attr('style'), 'class:', cart.attr('class'));
console.log('Menu style:', menu.attr('style'), 'class:', menu.attr('class'));
