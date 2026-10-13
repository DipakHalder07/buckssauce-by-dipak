const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('Finding banner:');
$('*').each((i, el) => {
  const text = $(el).text();
  if (text.includes('BUILD YOUR OWN') || text.includes('SAVE $4')) {
    console.log('Banner tag:', el.tagName, 'class:', $(el).attr('class'), 'style:', $(el).attr('style'));
  }
});
