const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('.pin-spacer').each((i, el) => {
  const child = $(el).children().first();
  console.log(`Pin spacer ${i}:`);
  console.log('  Spacer style:', $(el).attr('style'));
  console.log('  Child tag:', child[0].tagName, 'class:', child.attr('class'));
  console.log('  Child style:', child.attr('style'));
});
