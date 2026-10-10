const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'), { decodeEntities: false });

const foods = $('#bucks-preloader [data-food]');

const foodConfigs = [
  { style: 'position: absolute; bottom: 10%; left: 18%; width: 160px; height: 160px; opacity: 0;' },
  { style: 'position: absolute; top: 15%; left: 32%; width: 140px; height: 140px; opacity: 0;' },
  { style: 'position: absolute; top: 22%; right: 15%; width: 140px; height: 140px; opacity: 0;' },
  { style: 'position: absolute; bottom: 10%; right: 25%; width: 180px; height: 180px; opacity: 0;' }
];

foods.each((i, food) => {
  const cfg = foodConfigs[i];
  if (!cfg) return;
  $(food).attr('style', cfg.style);
});

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Restored accurate food positioning styles in index.html!');
