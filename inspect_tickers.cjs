const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const pNumContainer = $('[data-product-numbers]');
console.log('Numbers container class:', pNumContainer.attr('class'), 'style:', pNumContainer.attr('style'));
pNumContainer.find('[data-product-number]').each((i, el) => {
  console.log('  Num', i, 'style:', $(el).attr('style'), 'class:', $(el).attr('class'));
});

const pNamesContainer = $('[data-product-names]');
console.log('Names container class:', pNamesContainer.attr('class'), 'style:', pNamesContainer.attr('style'));
pNamesContainer.find('[data-product-name]').each((i, el) => {
  console.log('  Name', i, 'style:', $(el).attr('style'), 'class:', $(el).attr('class'));
});
