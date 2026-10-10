const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-reason]').each((i, el) => {
  console.log(`=== Reason ${i} ===`);
  console.log('Class:', $(el).attr('class'));
  console.log('Digit:', $(el).find('[data-reason-digit]').text());
  console.log('Title:', $(el).find('[data-reason-title]').text());
  console.log('Copy:', $(el).find('[data-reason-copy]').text().trim());
});
