const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'), { decodeEntities: false });

const foods = $('#bucks-preloader [data-food]');

const foodConfigs = [
  // Food 0: Pineapple (bottom-left)
  { style: 'position: absolute; bottom: 8%; left: 15%; width: 160px; height: 160px; opacity: 0;' },
  // Food 1: Habanero (top-left, clear of BUCKS text)
  { style: 'position: absolute; top: 8%; left: 25%; width: 140px; height: 140px; opacity: 0;' },
  // Food 2: Cherry (top-right)
  { style: 'position: absolute; top: 18%; right: 15%; width: 140px; height: 140px; opacity: 0;' },
  // Food 3: Peach (bottom-right)
  { style: 'position: absolute; bottom: 8%; right: 22%; width: 180px; height: 180px; opacity: 0;' }
];

foods.each((i, food) => {
  const cfg = foodConfigs[i];
  if (!cfg) return;
  $(food).attr('style', cfg.style);
});

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Optimized food positions in index.html to match live site spacing!');
