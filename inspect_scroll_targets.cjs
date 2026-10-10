const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

console.log('--- ALL SCROLL ANIMATION TARGETS ---');
$('[data-gsap-title-on-scroll], [data-gsap-slide-in-on-scroll], [data-gsap-text-on-scroll]').each((i, el) => {
  console.log(`Scroll Target ${i}: tag=${el.tagName} class="${$(el).attr('class')?.substring(0, 50)}" text="${$(el).text().replace(/\s+/g, ' ').trim().substring(0, 50)}" attrs=${Object.keys(el.attribs).filter(k => k.startsWith('data-')).join(' ')}`);
});
