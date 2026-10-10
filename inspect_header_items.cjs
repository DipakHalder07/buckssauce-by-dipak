const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const headerDiv = $('header > div');
headerDiv.children().each((i, el) => {
  console.log(`Header item ${i}: tag=${el.tagName} class="${$(el).attr('class')}" data="${Object.keys(el.attribs || {}).filter(k => k.startsWith('data-')).join(' ')}" text="${$(el).text().trim()}"`);
});
