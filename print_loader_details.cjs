const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('exact_live_loader.html', 'utf8'));

// Print top level elements inside the loader
const root = $('body > div, .z-9999').first();
console.log('Root:', root.prop('tagName'), root.attr('class'), root.attr('style'));

root.children().each((i, el) => {
  console.log(`Child ${i}:`, el.tagName, $(el).attr('class'), $(el).attr('style'), Object.keys(el.attribs || {}));
  $(el).children().each((j, sub) => {
    console.log(`  Sub ${j}:`, sub.tagName, $(sub).attr('class'), $(sub).attr('style'), Object.keys(sub.attribs || {}));
    if ($(sub).find('img').length) {
      console.log(`    Img src:`, $(sub).find('img').attr('src'));
    }
  });
});
