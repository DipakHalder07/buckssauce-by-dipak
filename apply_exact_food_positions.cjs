const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const foods = $('#bucks-preloader [data-food]');

const foodConfigs = [
  // Food 0: Pineapple (bottom-left)
  {
    style: 'position: absolute; bottom: 10%; left: 18%; width: 160px; height: 160px;',
    src: '/images/pineapple-loader.webp',
    alt: 'Pineapple'
  },
  // Food 1: Habanero (top-left)
  {
    style: 'position: absolute; top: 15%; left: 32%; width: 140px; height: 140px;',
    src: '/images/habanero-loader.webp',
    alt: 'Habanero'
  },
  // Food 2: Cherry (top-right)
  {
    style: 'position: absolute; top: 22%; right: 15%; width: 140px; height: 140px;',
    src: '/images/cherry-loader.webp',
    alt: 'Cherry'
  },
  // Food 3: Peach (bottom-right)
  {
    style: 'position: absolute; bottom: 10%; right: 25%; width: 180px; height: 180px;',
    src: '/images/peach-loader.webp',
    alt: 'Peach'
  }
];

foods.each((i, food) => {
  const cfg = foodConfigs[i];
  if (!cfg) return;
  $(food).attr('style', cfg.style);
  const img = $(food).find('img');
  img.attr('src', cfg.src);
  img.attr('alt', cfg.alt);
  img.attr('class', 'w-full h-full object-contain pointer-events-none select-none');
  img.removeAttr('srcset');
  img.removeAttr('sizes');
  img.removeAttr('data-nimg');
});

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Applied exact pixel-perfect food positions in index.html!');
