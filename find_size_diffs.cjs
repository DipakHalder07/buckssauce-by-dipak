const fs = require('fs');
const data = JSON.parse(fs.readFileSync('compare_parallax_foods.json', 'utf8'));

console.log('Comparing food items...');
data.local.forEach((loc, idx) => {
  const liv = data.live[idx + 4]; // skip first 4 loader foods in live
  if (liv) {
    const locW = loc.computedOuter.width;
    const livW = liv.computedOuter.width;
    const locImgW = loc.img?.computedWidth;
    const livImgW = liv.img?.computedWidth;
    const diff = locW !== livW || locImgW !== livImgW;
    if (diff) {
      console.log(`[Item ${idx}] diff: local outer=${locW} (img=${locImgW}) vs live outer=${livW} (img=${livImgW}) | class: ${loc.outerClass} | src: ${loc.img?.src?.slice(0, 30)}`);
    }
  }
});
