const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const fruit0 = $('[data-front-fruits]').children().eq(0).find('img').attr('src');
const fruit1 = $('[data-front-fruits]').children().eq(1).find('img').attr('src');
const fruit2 = $('[data-front-fruits]').children().eq(2).find('img').attr('src');
const fruit3 = $('[data-front-fruits]').children().eq(3).find('img').attr('src');

const logoSvg = $('[data-logo] svg').parent().html();

console.log('Fruit0 length:', fruit0?.length);
console.log('Fruit1 length:', fruit1?.length);
console.log('Fruit2 length:', fruit2?.length);
console.log('Fruit3 length:', fruit3?.length);
console.log('Logo SVG length:', logoSvg?.length);

fs.writeFileSync('tools/loader_assets.json', JSON.stringify({
  fruit0, fruit1, fruit2, fruit3, logoSvg
}));
console.log('Saved tools/loader_assets.json');
