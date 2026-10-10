const fs = require('fs');
const cheerio = require('cheerio');

const $live = cheerio.load(fs.readFileSync('exact_live_header.html', 'utf8'));
const $local = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- LIVE Header attributes ---');
console.log($live('header').attr('class'));
console.log($live('header').attr('style'));

console.log('--- LOCAL Header attributes ---');
console.log($local('header').attr('class'));
console.log($local('header').attr('style'));

console.log('--- LIVE Desktop Nav ---');
console.log($live('[data-desktop-nav]').html().length);
console.log($live('[data-desktop-nav] li').map((i, el) => $live(el).text().trim()).get());

console.log('--- LOCAL Desktop Nav ---');
console.log($local('[data-desktop-nav]').html()?.length);
console.log($local('[data-desktop-nav] li').map((i, el) => $local(el).text().trim()).get());
