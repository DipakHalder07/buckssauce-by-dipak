const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const headerLogo = $('header [data-logo]');
const preloaderLogo = $('#bucks-preloader [data-logo]');

console.log('=== HEADER LOGO ===');
console.log('A class:', headerLogo.attr('class'));
console.log('A style:', headerLogo.attr('style'));
console.log('SVG class:', headerLogo.find('svg').attr('class'));
console.log('SVG width:', headerLogo.find('svg').attr('width'));
console.log('SVG height:', headerLogo.find('svg').attr('height'));
console.log('SVG viewBox:', headerLogo.find('svg').attr('viewBox'));

console.log('\n=== PRELOADER LOGO ===');
console.log('DIV class:', preloaderLogo.attr('class'));
console.log('DIV style:', preloaderLogo.attr('style'));
console.log('SVG class:', preloaderLogo.find('svg').attr('class'));
console.log('SVG width:', preloaderLogo.find('svg').attr('width'));
console.log('SVG height:', preloaderLogo.find('svg').attr('height'));
console.log('SVG viewBox:', preloaderLogo.find('svg').attr('viewBox'));
