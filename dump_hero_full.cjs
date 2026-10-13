const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const hero = $('[data-home-hero]');
fs.writeFileSync('hero_markup.html', hero.html());
console.log('Hero HTML dumped. Length:', hero.html().length);
