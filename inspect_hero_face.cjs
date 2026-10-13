const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('hero_markup.html', 'utf8'));

// Check for SVGs, canvas, or face elements
$('svg').each((i, el) => {
  console.log(`SVG ${i}: id="${$(el).attr('id')}" class="${$(el).attr('class')}" children=${$(el).children().length}`);
});

$('img').each((i, el) => {
  console.log(`IMG ${i}: alt="${$(el).attr('alt')}" src="${$(el).attr('src')?.slice(0, 50)}" class="${$(el).attr('class')}"`);
});

$('[class*="face"], [id*="face"], [data-face]').each((i, el) => {
  console.log('Face match:', el.tagName, $(el).attr('class'), $(el).attr('id'));
});
