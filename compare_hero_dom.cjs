const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const hero = $('[data-home-hero]');
console.log('Hero class:', hero.attr('class'));
console.log('Hero inline style:', hero.attr('style'));

hero.children().each((i, el) => {
  console.log(`Hero child ${i}: <${el.tagName}> class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
});

const $idx = cheerio.load(fs.readFileSync('index.html', 'utf8'));
const idxHero = $idx('[data-home-hero]');
console.log('\n--- INDEX.HTML HERO ---');
console.log('Hero class:', idxHero.attr('class'));
console.log('Hero inline style:', idxHero.attr('style'));
idxHero.children().each((i, el) => {
  console.log(`Hero child ${i}: <${el.tagName}> class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
});
