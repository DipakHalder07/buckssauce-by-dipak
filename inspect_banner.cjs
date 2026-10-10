const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const span = $('span:contains("BUILD YOUR OWN 3-PACK & SAVE $4 Bucks")');
console.log('Parent:', span.parent().prop('tagName'), span.parent().attr('class'), span.parent().attr('data-banner'));
console.log('Grandparent:', span.parent().parent().prop('tagName'), span.parent().parent().attr('class'));
console.log('Outer HTML:');
console.log($.html(span.parent().parent()));
