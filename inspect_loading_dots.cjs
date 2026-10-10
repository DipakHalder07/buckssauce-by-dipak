const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('[class*="animate-[bucks-loading-dot"]').each((i, el) => {
  if (i < 3) {
    console.log(`Parent ${i}:`, $(el).parent().parent().html());
  }
});
