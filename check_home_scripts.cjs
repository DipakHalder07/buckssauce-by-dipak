const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('script').each((i, el) => {
  const src = $(el).attr('src');
  const text = $(el).html();
  if (src) {
    console.log(`Script ${i} src:`, src);
  } else if (text && text.length > 0) {
    console.log(`Inline script ${i} length:`, text.length);
    if (text.includes('ScrollTrigger') || text.includes('gsap') || text.includes('header') || text.includes('antler')) {
      console.log(`  Contains keywords!`);
    }
  }
});
