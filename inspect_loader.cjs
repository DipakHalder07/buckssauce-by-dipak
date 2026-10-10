const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const loader = $('main > div.fixed.top-0.left-0.w-full.h-dvh');
console.log('Loader found:', loader.length);
console.log('Loader class:', loader.attr('class'));
console.log('Loader style:', loader.attr('style'));
console.log('\nLoader HTML:');
console.log(loader.html());
