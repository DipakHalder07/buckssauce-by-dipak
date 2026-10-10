const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const header = $('header');
console.log('Header outerHTML (first 800 chars):');
console.log(header.prop('outerHTML').slice(0, 800));

const logo = header.find('a[href="/"], [data-logo], svg').first();
console.log('Logo parent:', logo.parent().attr('class'));
console.log('Logo class:', logo.attr('class'));
