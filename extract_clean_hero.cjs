const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const hero = $('[data-home-hero]').clone();
hero.find('img').each((i, el) => {
  const src = $(el).attr('src');
  if (src && src.startsWith('data:')) {
    $(el).attr('src', `[data-uri len=${src.length}]`);
  }
});

fs.writeFileSync('hero_clean.html', hero.html());
console.log('Clean hero saved! Length:', hero.html().length);
