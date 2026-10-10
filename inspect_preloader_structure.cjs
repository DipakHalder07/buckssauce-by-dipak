const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

const preloader = $('#bucks-preloader');
console.log('Preloader outer tag:', preloader.prop('tagName'), preloader.attr('id'), preloader.attr('class'), preloader.attr('style'));
console.log('Circles count:', preloader.find('[data-circle]').length);
preloader.find('[data-circle]').each((i, el) => {
  console.log(`Circle ${i}:`, $(el).attr('class'), 'style:', $(el).attr('style'));
});
console.log('Logo tag:', preloader.find('[data-logo]').prop('tagName'), preloader.find('[data-logo]').attr('class'), 'style:', preloader.find('[data-logo]').attr('style'));
console.log('SVG tag:', preloader.find('[data-logo] svg').attr('class'), 'w:', preloader.find('[data-logo] svg').attr('width'), 'h:', preloader.find('[data-logo] svg').attr('height'));
console.log('Foods count:', preloader.find('[data-food]').length);
preloader.find('[data-food]').each((i, el) => {
  console.log(`Food ${i}:`, $(el).attr('class'), 'style:', $(el).attr('style'));
});
