const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

// 1. Ensure #bucks-preloader has bg-[#100b06]
const loader = $('#bucks-preloader');
loader.addClass('bg-[#100b06]');
let loaderStyle = loader.attr('style') || '';
loaderStyle = loaderStyle.replace(/background(-color)?:\s*[^;]+;?/g, '');
loaderStyle += ';background-color:#100b06;';
loader.attr('style', loaderStyle);

// 2. Ensure data-home-hero starts with opacity: 0
const hero = $('[data-home-hero]');
let heroStyle = hero.attr('style') || '';
heroStyle = heroStyle.replace(/opacity:\s*[^;]+;?/g, '');
heroStyle += ';opacity:0;';
hero.attr('style', heroStyle);

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Updated index.html: loader solid background and hero initial opacity:0 set!');
