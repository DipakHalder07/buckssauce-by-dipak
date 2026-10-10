const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- Sections in index.html ---');
$('section').each((i, sec) => {
  console.log(`Section ${i}:`, {
    class: $(sec).attr('class')?.slice(0, 50),
    dataAttrs: Object.keys(sec.attribs || {}).filter(k => k.startsWith('data-')),
    title: $(sec).find('h1, h2, h3, [data-title], [data-gsap-title-on-scroll]').text().trim().replace(/\s+/g, ' ').slice(0, 60)
  });
});

console.log('--- Section 1 cards ---');
console.log('Cards count:', $('[data-card]').length);
$('[data-card]').each((i, card) => {
  console.log(`Card ${i} tag=${card.tagName} class="${$(card).attr('class')?.slice(0, 40)}" style="${$(card).attr('style')}"`);
});

console.log('--- Listing cards ---');
console.log('Listing cards count:', $('[data-listing-card]').length);
$('[data-listing-card]').each((i, card) => {
  const left = $(card).find('[data-left-antler]');
  const right = $(card).find('[data-right-antler]');
  console.log(`Listing card ${i}: hasLeft=${left.length} hasRight=${right.length}`);
});

console.log('--- Parallax food ---');
console.log('Parallax food count:', $('[data-parallax-food]').length);
$('[data-parallax-food]').each((i, food) => {
  console.log(`Food ${i}: speed="${$(food).attr('data-parallax-speed')}" mouseForce="${$(food).attr('data-parallax-mouse-force')}"`);
});
