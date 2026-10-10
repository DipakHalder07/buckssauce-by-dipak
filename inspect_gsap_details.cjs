const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

console.log('--- GSAP data attrs ---');
['data-gsap-slide-in-on-scroll', 'data-gsap-text-on-scroll', 'data-gsap-title', 'data-gsap-title-on-scroll'].forEach(attr => {
  const els = $(`[${attr}]`);
  console.log(`${attr}: count = ${els.length}`);
  els.each((i, el) => {
    if (i < 3) console.log(`  [${attr}] ${i}: tag=${el.tagName} class=${$(el).attr('class')?.substring(0, 50)} text=${$(el).text().trim().substring(0, 40)}`);
  });
});

console.log('\n--- Parallax data attrs ---');
$('[data-parallax-food]').each((i, el) => {
  console.log(`Food ${i}: dist=${$(el).attr('data-parallax-distance')} amp=${$(el).attr('data-parallax-float-amplitude')} speed=${$(el).attr('data-parallax-speed')} mouse=${$(el).attr('data-parallax-mouse-force')}`);
});

console.log('\n--- Why Bucks Sauce section ---');
const whyBucks = $('[data-why-bucks-sauce]');
console.log('Why Bucks exists:', whyBucks.length);
whyBucks.find('[data-reason]').each((i, el) => {
  console.log(`Reason ${i}: title=${$(el).find('[data-reason-title]').text().trim()} copy=${$(el).find('[data-reason-copy]').text().trim().substring(0, 40)} style=${$(el).attr('style')}`);
});
