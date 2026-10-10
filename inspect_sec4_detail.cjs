const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const sec4 = $('[data-why-bucks-sauce]');
console.log('Sec 4 reasons:');
sec4.find('[data-reason]').each((i, el) => {
  console.log(`Reason ${i}: title="${$(el).find('[data-reason-title]').text().trim()}"`);
});
console.log('Sec 4 arc letters:', sec4.find('[data-arc-letter]').length);
console.log('Sec 4 buttons/arrows:', sec4.find('[data-slider-arrow]').length);
