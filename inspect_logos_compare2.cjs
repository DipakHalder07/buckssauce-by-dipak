const fs = require('fs');
const cheerio = require('cheerio');

if (fs.existsSync('exact_live_body.html')) {
  const live$ = cheerio.load(fs.readFileSync('exact_live_body.html', 'utf8'));
  live$('[data-logo]').each((i, el) => {
    console.log(`Live Logo ${i}:`, live$(el).attr('class'), 'Parent:', live$(el).parent().attr('class'));
    const svg = live$(el).find('svg');
    if (svg.length) {
      console.log('SVG:', svg.attr('class'), 'width/height:', svg.attr('width'), svg.attr('height'), 'viewBox:', svg.attr('viewBox'));
      console.log('SVG contents prefix:', svg.html().slice(0, 200));
    }
  });
}
