const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const sec5 = $('section').eq(5);
console.log('Sec 5 heading:', sec5.find('h2, [data-reviews-title]').text().trim());
console.log('Sec 5 review cards count:', sec5.find('[data-review-card]').length);
sec5.find('[data-review-card]').each((i, el) => {
  console.log(`Review ${i}: author="${$(el).find('p, span, div').first().text().trim()}" text="${$(el).text().replace(/\s+/g, ' ').trim().substring(0, 60)}"`);
});
