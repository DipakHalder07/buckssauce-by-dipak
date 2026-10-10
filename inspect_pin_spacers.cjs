const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('.pin-spacer').each((i, el) => {
  console.log(`Pin spacer ${i}: parent=${el.parent.tagName}.${$(el.parent).attr('class')?.substring(0, 30)}`);
  console.log(`  Children count: ${$(el).children().length}`);
  $(el).children().each((j, child) => {
    console.log(`    Child ${j}: tag=${child.tagName} class="${$(child).attr('class')?.substring(0, 40)}" style="${$(child).attr('style')?.substring(0, 60)}"`);
  });
});
