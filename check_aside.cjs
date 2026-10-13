const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));
console.log('aside in index.html:', $('aside').length);
console.log('aside class:', $('aside').attr('class'));
console.log('aside style:', $('aside').attr('style'));
console.log('aside text:', $('aside').text().trim());
