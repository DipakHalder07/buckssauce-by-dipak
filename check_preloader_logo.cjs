const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const preloaderLogo = $('#bucks-preloader [data-logo] svg');
console.log('Preloader logo svg found:', preloaderLogo.length);
console.log('#bucks path count:', preloaderLogo.find('#bucks path').length);
console.log('#sauce path count:', preloaderLogo.find('#sauce path').length);
console.log('#left-horn found:', preloaderLogo.find('#left-horn').length);
console.log('#right-horn found:', preloaderLogo.find('#right-horn').length);
console.log('#head found:', preloaderLogo.find('#head').length);
