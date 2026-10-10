const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const banner = $('[data-banner]');
console.log('Banner tag:', banner.prop('tagName'), 'classes:', banner.attr('class'));
console.log('Banner text:', banner.text().replace(/\s+/g, ' ').trim());
console.log('Banner parent:', banner.parent().prop('tagName'), banner.parent().attr('class'));
