const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

console.log('Front fruits containers:', $('[data-front-fruits]').length);
$('[data-front-fruits]').each((i, el) => {
  console.log('Front container', i, 'children:', $(el).children().length);
  $(el).children().each((j, child) => {
    console.log('  Child', j, 'style:', $(child).attr('style'), 'class:', $(child).attr('class'));
  });
});

console.log('Back fruits containers:', $('[data-back-fruits]').length);
$('[data-back-fruits]').each((i, el) => {
  console.log('Back container', i, 'children:', $(el).children().length);
  $(el).children().each((j, child) => {
    console.log('  Child', j, 'style:', $(child).attr('style'), 'class:', $(child).attr('class'));
  });
});
