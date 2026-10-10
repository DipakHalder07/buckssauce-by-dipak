const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const sec2 = $('section').eq(2);
sec2.find('[data-listing-card]').each((i, el) => {
  console.log(`Card ${i} text:`, $(el).text().replace(/\s+/g, ' ').trim().substring(0, 100));
  console.log(`Card ${i} images:`, $(el).find('img').length);
});
