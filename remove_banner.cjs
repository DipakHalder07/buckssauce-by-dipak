const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

// Remove the banner aside
const banner = $('aside[data-banner="true"], aside[data-banner]');
console.log('Found banners to remove:', banner.length);
banner.remove();

// Check header positioning
const header = $('header');
console.log('Header before fix:');
console.log('class:', header.attr('class'));
console.log('style:', header.attr('style'));

// In header, ensure style has top: 0px and opacity: 1
let headerStyle = header.attr('style') || '';
headerStyle = headerStyle.replace(/top:\s*[^;]+;?/g, 'top:0px;');
if (!headerStyle.includes('top:')) headerStyle += ';top:0px;';
header.attr('style', headerStyle);

// Also check hero section top margin so it doesn't leave an unnecessary gap
// Let's check hero section classes
const heroSec = $('[data-home-hero]');
console.log('Hero section class:', heroSec.attr('class'));

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Updated index.html without banner!');
