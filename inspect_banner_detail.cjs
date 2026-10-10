const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const banner = $('aside[data-banner="true"], aside[data-banner]');
console.log('Banner count:', banner.length);
if (banner.length) {
  console.log('Banner HTML:', banner.prop('outerHTML'));
}

const header = $('header');
console.log('Header class:', header.attr('class'));
console.log('Header style:', header.attr('style'));
