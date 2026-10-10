const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const sec1 = $('section').eq(1);
console.log('Section 1 outer class:', sec1.attr('class'));
console.log('Section 1 cards count:', sec1.find('[data-card]').length);
sec1.find('[data-card]').each((i, el) => {
  console.log(`Card ${i}: style="${$(el).attr('style')}" class="${$(el).attr('class')}"`);
  console.log(`  Title: ${$(el).find('h2, h3, div').first().text().trim().substring(0, 30)}`);
  console.log(`  Header: ${$(el).find('[data-card-header]').text().trim()}`);
});
