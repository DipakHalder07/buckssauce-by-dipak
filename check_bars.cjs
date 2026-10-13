const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const hero = $('[data-home-hero]');
console.log('Hero tag:', hero[0].tagName);
console.log('Hero attributes:', hero.attr());
console.log('Middle bar:');
console.log($('[data-middle-bar]').parent().html().slice(0, 400));
console.log('\nBottom bar:');
console.log($('[data-bottom-bar]').html().slice(0, 400));
