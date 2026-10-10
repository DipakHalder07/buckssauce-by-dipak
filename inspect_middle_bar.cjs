const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const pn = $('[data-product-numbers]');
console.log('Product numbers parent:', pn.parent().html());
console.log('Product names parent:', $('[data-product-names]').parent().html());
