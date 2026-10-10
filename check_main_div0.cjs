const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const mainDiv = $('main > div').first();
console.log('Main div 0:', mainDiv.attr('class'), mainDiv.attr('style'));
