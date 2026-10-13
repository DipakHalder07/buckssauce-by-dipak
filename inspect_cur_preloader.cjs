const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));
const loader = $('#bucks-preloader');
console.log('Loader tag:', loader[0]?.tagName, 'classes:', loader.attr('class'));
console.log('Loader children:', loader.children().length);
loader.children().each((i, el) => {
  console.log('Child', i, el.tagName, $(el).attr('class'), $(el).data());
});
