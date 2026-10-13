const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- FRONT FRUITS IN INDEX.HTML ---');
$('[data-front-fruits]').children().each((i, el) => {
  console.log(`Fruit ${i}: tag=${el.tagName} class="${$(el).attr('class')}"`);
  console.log('HTML:', $(el).html().slice(0, 300));
  console.log('---');
});
