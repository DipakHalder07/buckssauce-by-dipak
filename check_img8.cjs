const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('hero_markup.html', 'utf8'));
const src = $('img').eq(8).attr('src');
console.log('IMG 8 outer HTML:');
console.log($('img').eq(8).parent().parent().html().slice(0, 500));
console.log('IMG 8 src:', src);
