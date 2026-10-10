const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const preloader = $('#bucks-preloader');
console.log('Preloader found:', preloader.length);
console.log('Class:', preloader.attr('class'));
console.log('Style:', preloader.attr('style'));
console.log('Children count:', preloader.children().length);

preloader.children().each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class'), Object.keys(el.attribs).filter(k => k.startsWith('data-')).join(' '));
  console.log('  inner HTML length:', $(el).html().length);
});
