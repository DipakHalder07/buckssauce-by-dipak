const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('Scripts in index.html:');
$('script').each((i, el) => {
  console.log(`Script ${i}: src="${$(el).attr('src')}" type="${$(el).attr('type')}" inlineLen=${$(el).html().length}`);
});

console.log('Root element in index.html:');
console.log($('#root').length ? '#root exists' : 'no #root');
