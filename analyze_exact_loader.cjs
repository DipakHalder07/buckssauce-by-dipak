const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_loader.html', 'utf8'));

console.log('Loader root tag:', $('*').first().prop('tagName'));
console.log('Loader root class:', $('*').first().attr('class'));
console.log('Loader root style:', $('*').first().attr('style'));

$('*').each((i, el) => {
  const d = Object.keys(el.attribs || {}).filter(k => k.startsWith('data-'));
  const id = el.attribs?.id ? '#' + el.attribs.id : '';
  const cls = el.attribs?.class ? '.' + el.attribs.class.slice(0, 40) : '';
  if (d.length > 0 || id || el.tagName === 'svg' || el.tagName === 'img') {
    console.log(`${el.tagName}${id}${cls} [${d.join(' ')}] src=${$(el).attr('src')?.slice(0, 40)}`);
  }
});
