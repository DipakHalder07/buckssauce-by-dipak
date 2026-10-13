const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('hero_clean.html', 'utf8'));

console.log('--- DIRECT CHILDREN OF HERO ---');
$(':root').children().each((i, el) => {
  console.log(`Child ${i}: <${el.tagName} class="${$(el).attr('class')}" data-attrs="${Object.keys(el.attribs).filter(k => k.startsWith('data-'))}">`);
});

// Let's print the structure
function printTree(el, indent = '') {
  const dataKeys = Object.keys(el.attribs || {}).filter(k => k.startsWith('data-')).join(',');
  const cls = (el.attribs?.class || '').split(' ').slice(0, 3).join(' ');
  console.log(`${indent}<${el.tagName} ${dataKeys ? `[${dataKeys}] ` : ''}class="${cls}">`);
  $(el).children().each((_, child) => {
    printTree(child, indent + '  ');
  });
}

console.log('\n--- HERO TREE (UP TO 3 LEVELS) ---');
$(':root').children().each((i, el) => {
  printTree(el, '  ');
});
