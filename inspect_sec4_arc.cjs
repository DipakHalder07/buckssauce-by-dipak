const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const sec4 = $('[data-why-bucks-sauce]');
console.log('Arc letters parent:');
const arcParent = sec4.find('[data-arc-letter]').parent();
console.log('  Parent class:', arcParent.attr('class'), 'style:', arcParent.attr('style'));
sec4.find('[data-arc-letter]').each((i, el) => {
  if (i < 5) console.log(`  Letter ${i}: text="${$(el).text()}" style="${$(el).attr('style')}"`);
});
