const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

console.log('--- Search for loader / preloader / intro in home.html ---');
$('*').each((i, el) => {
  const cls = $(el).attr('class') || '';
  const id = $(el).attr('id') || '';
  const data = Object.keys(el.attribs || {}).filter(k => k.startsWith('data-')).join(' ');
  const allStr = `${cls} ${id} ${data}`.toLowerCase();
  
  if (allStr.includes('load') || allStr.includes('intro') || allStr.includes('splash') || allStr.includes('preloader') || allStr.includes('gate') || allStr.includes('curtain')) {
    console.log(`Found: tag=${el.tagName} id="${id}" class="${cls.substring(0, 50)}" data="${data}"`);
  }
});
