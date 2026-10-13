const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));
const svg = $('#bucks-preloader [data-logo] svg');
fs.writeFileSync('local_loader_svg.html', svg.html());
console.log('Saved local_loader_svg.html, length:', svg.html().length);
