const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const desktopNav = $('[data-desktop-nav]');
console.log('Desktop nav style:', desktopNav.attr('style'));
console.log('Desktop nav class:', desktopNav.attr('class'));
