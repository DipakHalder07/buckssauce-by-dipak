const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);
const leftHorn = $('#bucks-preloader #left-horn');
const rightHorn = $('#bucks-preloader #right-horn');
console.log('leftHorn style before:', leftHorn.attr('style'));
console.log('rightHorn style before:', rightHorn.attr('style'));

// Remove style attribute from horns so GSAP has 100% control
leftHorn.removeAttr('style');
rightHorn.removeAttr('style');

// Also check #bucks and #sauce letters styles
$('#bucks-preloader #bucks path').removeAttr('style');
$('#bucks-preloader #sauce path').removeAttr('style');

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Cleaned inline styles on SVG parts in index.html');
