const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const sec3 = $('section').eq(3);
console.log('Section 3 heading:', sec3.find('h2').text().trim());
console.log('Section 3 buttons/interactive elements:', sec3.find('button, a, input, [data-button-bg]').length);
sec3.find('button, a').each((i, el) => {
  console.log(`Sec 3 btn ${i}: text="${$(el).text().replace(/\s+/g, ' ').trim()}" href="${$(el).attr('href')}"`);
});
