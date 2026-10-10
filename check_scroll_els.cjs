const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-gsap-title-on-scroll]').each((i, el) => {
  console.log(`Title on scroll ${i}: tag=${el.tagName} text="${$(el).text().trim()}"`);
});

$('[data-gsap-slide-in-on-scroll]').each((i, el) => {
  console.log(`Slide in on scroll ${i}: tag=${el.tagName} class="${$(el).attr('class')?.slice(0, 40)}"`);
});

$('[data-gsap-text-on-scroll]').each((i, el) => {
  console.log(`Text on scroll ${i}: tag=${el.tagName} text="${$(el).text().trim().slice(0, 50)}"`);
});
