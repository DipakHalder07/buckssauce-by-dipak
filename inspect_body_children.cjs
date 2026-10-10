const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

console.log('--- Direct children of body ---');
$('body').children().each((i, el) => {
  console.log(`Body child ${i}: tag=${el.tagName} class="${$(el).attr('class')}" id="${$(el).attr('id')}" data="${Object.keys(el.attribs || {}).filter(k => k.startsWith('data-')).join(' ')}" style="${$(el).attr('style')?.substring(0, 50)}"`);
});

console.log('\n--- Direct children of main ---');
$('main').children().each((i, el) => {
  console.log(`Main child ${i}: tag=${el.tagName} class="${$(el).attr('class')}" id="${$(el).attr('id')}" data="${Object.keys(el.attribs || {}).filter(k => k.startsWith('data-')).join(' ')}" style="${$(el).attr('style')?.substring(0, 50)}"`);
});
