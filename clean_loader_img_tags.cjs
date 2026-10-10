const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const foods = $('#bucks-preloader [data-food]');
const imageMap = [
  '/images/pineapple-loader.webp',
  '/images/habanero-loader.webp',
  '/images/cherry-loader.webp',
  '/images/peach-loader.webp'
];

foods.each((i, food) => {
  // Reset style on data-food container so Tailwind position classes work
  $(food).removeAttr('style');
  
  // Clean img element
  const img = $(food).find('img');
  img.removeAttr('srcset');
  img.removeAttr('sizes');
  img.removeAttr('data-nimg');
  img.attr('src', imageMap[i]);
  img.attr('class', 'w-full h-full object-contain pointer-events-none');
});

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Cleaned loader images and containers in index.html!');
