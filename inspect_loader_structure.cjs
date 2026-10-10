const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_loader.html', 'utf8'));

// Print the markup without the massive svg path data
$('svg path').each((i, el) => {
  if (i > 3) $(el).remove();
});
console.log($.html().slice(0, 2500));
