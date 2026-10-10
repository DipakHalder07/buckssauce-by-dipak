const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

// Let's inspect sec 1 in index.html:
const sec1 = $('section').eq(1);
console.log('Sec 1 HTML (first 300 chars):', sec1.html().substring(0, 300));
console.log('Sec 1 style:', sec1.attr('style'));
console.log('Sec 1 children:');
sec1.children().each((i, el) => {
  console.log(`Child ${i}: tag=${el.tagName} class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
});
