const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('script').each((i, el) => {
  console.log(`Script ${i}: src="${$(el).attr('src')}" type="${$(el).attr('type')}"`);
});
