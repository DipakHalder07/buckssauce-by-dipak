const fs = require('fs');
const data = JSON.parse(fs.readFileSync('compare_parallax_foods.json', 'utf8'));

console.log('--- LIVE PARALLAX FOOD SAMPLES ---');
data.live.slice(0, 10).forEach(item => {
  console.log(`[#${item.index}] sec: ${item.section} | w: ${item.computedOuter.width} h: ${item.computedOuter.height} | img: ${item.img?.computedWidth}x${item.img?.computedHeight} | src: ${item.img?.src?.slice(0, 50)}`);
});

console.log('--- LOCAL PARALLAX FOOD SAMPLES ---');
data.local.slice(0, 10).forEach(item => {
  console.log(`[#${item.index}] sec: ${item.section} | w: ${item.computedOuter.width} h: ${item.computedOuter.height} | img: ${item.img?.computedWidth}x${item.img?.computedHeight} | src: ${item.img?.src?.slice(0, 50)}`);
});
