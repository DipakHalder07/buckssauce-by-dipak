const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const desktopNav = $('[data-desktop-nav]');
desktopNav.attr('style', 'will-change:transform,opacity;translate:none;rotate:none;scale:none;opacity:1;transform:translate(0px,0px)');

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Fixed desktopNav style in index.html!');
