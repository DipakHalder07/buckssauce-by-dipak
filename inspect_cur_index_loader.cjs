const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const curLoader = $('#bucks-preloader');
console.log('Current loader found:', curLoader.length);
console.log('Class:', curLoader.attr('class'));
console.log('Children count:', curLoader.children().length);
curLoader.children().each((i, el) => {
  console.log(`Child ${i}:`, el.tagName, $(el).attr('class'), $(el).attr('id'));
});
