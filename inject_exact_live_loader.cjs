const fs = require('fs');
const cheerio = require('cheerio');

const base64Data = JSON.parse(fs.readFileSync('loader_fruits_base64.json', 'utf8'));
const loaderHtml = fs.readFileSync('exact_live_loader.html', 'utf8');
const $loader = cheerio.load(loaderHtml);

const root = $loader('body > div, .z-9999').first();
root.attr('id', 'bucks-preloader');
root.attr('style', 'opacity: 1; pointer-events: all; display: block;');

// Inject base64 into the 4 images
root.find('[data-food]').each((i, food) => {
  const img = $loader(food).find('img');
  const src = img.attr('src') || '';
  if (src.includes('pineapple') || i === 0) {
    img.attr('src', base64Data.pineapple);
    img.attr('alt', 'Pineapple');
  } else if (src.includes('habanero') || i === 1) {
    img.attr('src', base64Data.habanero);
    img.attr('alt', 'Habanero');
  } else if (src.includes('cherry') || i === 2) {
    img.attr('src', base64Data.cherry);
    img.attr('alt', 'Cherry');
  } else if (src.includes('peach') || i === 3) {
    img.attr('src', base64Data.peach);
    img.attr('alt', 'Peach');
  }
});

const newLoaderHtml = root.prop('outerHTML');
console.log('New loader HTML generated! Length:', newLoaderHtml.length);

// Replace #bucks-preloader in index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
const $index = cheerio.load(indexHtml);

const existingLoader = $index('#bucks-preloader');
if (existingLoader.length) {
  existingLoader.replaceWith(newLoaderHtml);
} else {
  $index('body').prepend(newLoaderHtml);
}

fs.writeFileSync('index.html', $index.html(), 'utf8');
console.log('Successfully injected pixel-perfect live loader into index.html!');
