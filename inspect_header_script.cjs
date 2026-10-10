const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- Header attributes & children ---');
$('header').each((i, el) => {
  console.log('Header class:', $(el).attr('class'));
  console.log('Header style:', $(el).attr('style'));
  $(el).find('*').each((j, child) => {
    const dataKeys = Object.keys(child.attribs || {}).filter(k => k.startsWith('data-'));
    if (dataKeys.length > 0 || child.tagName === 'a' || child.tagName === 'svg' || child.tagName === 'button') {
      console.log(`  <${child.tagName} data="${dataKeys.join(' ')}" class="${($(child).attr('class') || '').slice(0, 50)}">`);
    }
  });
});
