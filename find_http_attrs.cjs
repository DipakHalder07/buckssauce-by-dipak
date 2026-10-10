const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- Checking all tags with http ---');
$('*').each((i, el) => {
  const attrs = el.attribs || {};
  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v === 'string' && (v.includes('http://') || v.includes('https://'))) {
      if (k === 'src' || k === 'href' || k === 'srcset' || k === 'style' || k === 'content') {
        console.log(`Tag <${el.tagName}> attr ${k}: ${v.slice(0, 120)}`);
      }
    }
  }
});
