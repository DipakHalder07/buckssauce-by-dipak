const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

const hero = $('[data-home-hero]');
console.log('Hero tag:', hero[0]?.tagName);
console.log('Hero class:', hero.attr('class'));
console.log('Hero style:', hero.attr('style'));
console.log('Hero children count:', hero.children().length);

// Inspect banner
const banner = $('[data-top-banner], [data-announcement-bar], .bg-foreground\\/10');
console.log('Banner count:', banner.length);

// Inspect header
const header = $('header');
console.log('Header class:', header.attr('class'), 'style:', header.attr('style'));
