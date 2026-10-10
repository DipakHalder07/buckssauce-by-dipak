const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const cart = $('[data-cart]');
console.log('Cart count:', cart.length);
console.log('Cart class:', cart.attr('class'));
console.log('Cart style:', cart.attr('style'));
console.log('Cart inner class:', cart.find('[data-cart-inner]').attr('class'));
console.log('Cart inner style:', cart.find('[data-cart-inner]').attr('style'));

const menu = $('[data-menu]');
console.log('Menu count:', menu.length);
console.log('Menu class:', menu.attr('class'));
console.log('Menu style:', menu.attr('style'));
