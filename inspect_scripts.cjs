const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('script').each((i, el) => {
  const src = $(el).attr('src');
  const type = $(el).attr('type');
  const text = $(el).text();
  console.log(`Script ${i}: src=${src} type=${type} length=${text.length} preview=${text.substring(0, 120).replace(/\n/g, ' ')}`);
});
