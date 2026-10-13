const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

const heroChild1 = $('[data-home-hero]').children().eq(1);
heroChild1.children().each((i, el) => {
  console.log(`Hero child 1 -> Sub-child ${i}: <${el.tagName}> class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
});
