const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('section').each((i, el) => {
  const h = $(el).find('h1, h2, h3').text().trim().replace(/\s+/g, ' ').substring(0, 60);
  const data = Object.keys(el.attribs).filter(k => k.startsWith('data-')).join(', ');
  console.log(`Section ${i}: tag=${el.tagName} data=[${data}] class="${$(el).attr('class')?.substring(0, 40)}" heading="${h}"`);
});
