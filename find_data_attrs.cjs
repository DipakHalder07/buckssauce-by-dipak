const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const dataAttrs = new Set();
$('*').each((i, el) => {
  if (el.attribs) {
    for (const key of Object.keys(el.attribs)) {
      if (key.startsWith('data-')) {
        dataAttrs.add(key);
      }
    }
  }
});

console.log('All data-* attributes:', Array.from(dataAttrs).sort());
