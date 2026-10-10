const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const food0 = $('#bucks-preloader [data-food]').first();
console.log('Food 0 full HTML:\n', food0.prop('outerHTML').slice(0, 500));
const img = food0.find('img');
console.log('Img count in Food 0:', img.length);
console.log('Img src length:', img.attr('src')?.length);
console.log('Img attributes:', Object.keys(img[0]?.attribs || {}));
console.log('Img style:', img.attr('style'));
console.log('Img class:', img.attr('class'));
