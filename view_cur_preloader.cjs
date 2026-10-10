const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));
const preloader = $('#bucks-preloader');
console.log('Preloader HTML:\n', preloader.html().slice(0, 1500));
