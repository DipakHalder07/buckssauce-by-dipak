const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_header.html', 'utf8'));

function dump(el, depth = 0) {
  let tag = el.tagName;
  let id = el.attribs?.id ? '#' + el.attribs.id : '';
  let cls = el.attribs?.class ? '.' + el.attribs.class.split(' ').slice(0, 3).join('.') : '';
  let data = Object.keys(el.attribs || {}).filter(k => k.startsWith('data-')).map(k => `[${k}="${el.attribs[k]}"]`).join(' ');
  let style = el.attribs?.style ? ` style="${el.attribs.style.slice(0, 40)}..."` : '';
  console.log('  '.repeat(depth) + `<${tag}${id}${cls} ${data}${style}>`);
  
  if (tag === 'svg') return; // don't recurse into svg
  
  $(el).children().each((i, c) => {
    dump(c, depth + 1);
  });
}

dump($('header')[0]);
