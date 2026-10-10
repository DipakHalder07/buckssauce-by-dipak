const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

console.log('--- SECTION 2 CARDS ---');
$('[data-card]').each((i, el) => {
  console.log('Card', i, 'style:', $(el).attr('style'));
  console.log('Card', i, 'class:', $(el).attr('class'));
});
