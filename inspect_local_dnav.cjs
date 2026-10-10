const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log($('[data-desktop-nav]').html().slice(0, 1500));
