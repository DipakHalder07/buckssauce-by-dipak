const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- SLIDER ARROWS ---');
console.log('data-slider-arrow count:', $('[data-slider-arrow]').length);
$('[data-slider-arrow]').each((i, el) => {
  console.log('Arrow', i, 'class:', $(el).attr('class'), 'section:', $(el).closest('section').attr('data-home-hero') ? 'Hero' : 'Other');
});

console.log('\n--- BOTTLES ---');
console.log('data-bottle count:', $('[data-bottle]').length);
$('[data-bottle]').each((i, el) => {
  console.log('Bottle', i, 'class:', $(el).attr('class'));
});

console.log('\n--- PRODUCT NUMBERS ---');
console.log('data-product-number count:', $('[data-product-number]').length);
$('[data-product-number]').each((i, el) => {
  console.log('Number', i, 'text:', $(el).text());
});

console.log('\n--- PRODUCT NAMES ---');
console.log('data-product-name count:', $('[data-product-name]').length);
$('[data-product-name]').each((i, el) => {
  console.log('Name', i, 'text:', $(el).text());
});

console.log('\n--- WHY BUCKS SAUCE ---');
console.log('data-why-bucks-sauce count:', $('[data-why-bucks-sauce]').length);
console.log('data-reason count:', $('[data-reason]').length);

console.log('\n--- REVIEWS ---');
console.log('data-review-card count:', $('[data-review-card]').length);
