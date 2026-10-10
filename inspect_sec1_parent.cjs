const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const sec1 = $('section').eq(1);
console.log('Section 1 inner HTML structure:');
console.log(sec1.children().map((i, el) => `${el.tagName}.${$(el).attr('class')}`).get());
console.log('Parent of cards:', sec1.find('[data-card]').parent().attr('class'), 'style:', sec1.find('[data-card]').parent().attr('style'));
