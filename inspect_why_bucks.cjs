const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const whyBucks = $('[data-why-bucks-sauce]');
console.log('Why Bucks HTML length:', whyBucks.html()?.length);
console.log('Why Bucks arrows:', whyBucks.find('[data-slider-arrow]').length);
whyBucks.find('[data-slider-arrow]').each((i, el) => {
  console.log('Why arrow', i, $(el).attr('class'), $(el).html().substring(0, 50));
});

console.log('Why Bucks reasons count:', whyBucks.find('[data-reason]').length);
whyBucks.find('[data-reason]').each((i, el) => {
  console.log('Reason', i, 'classes:', $(el).attr('class'));
});
