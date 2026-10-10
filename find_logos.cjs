const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- Search all logo elements ---');
$('*').each((i, el) => {
  const d = Object.keys(el.attribs || {}).filter(k => k.includes('logo')).join(' ');
  const c = ($(el).attr('class') || '').toLowerCase();
  if (d || c.includes('logo')) {
    console.log(`Logo element: tag=${el.tagName} data="${d}" class="${c.substring(0, 50)}"`);
  }
});
