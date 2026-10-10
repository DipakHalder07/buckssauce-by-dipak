const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const cart = $('[data-cart]');
console.log('Cart children count:', cart.find('*').length);
console.log('Cart text:', cart.text().replace(/\s+/g, ' ').trim().substring(0, 200));
cart.find('[data-is-empty], [data-cart-content]').each((i, el) => {
  console.log(`Cart el ${i}: tag=${el.tagName} style="${$(el).attr('style')}" class="${$(el).attr('class')}"`);
});
