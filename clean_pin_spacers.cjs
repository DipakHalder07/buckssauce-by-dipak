const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

// 1. Unwrap pin-spacers
$('.pin-spacer').each((i, el) => {
  const child = $(el).children();
  $(el).replaceWith(child);
});

// 2. Clean frozen styles on Section 1
const sec1 = $('section.relative.p-container.pt-18');
if (sec1.length > 0) {
  sec1.removeAttr('style');
}

// 3. Clean frozen styles on Section 4 dial
const dial = $('.relative.h-\\[60vh\\].lg\\:h-\\[75vh\\]');
if (dial.length > 0) {
  dial.removeAttr('style');
}

// 4. Clean frozen cards styles in Section 1
$('[data-card]').each((i, el) => {
  if (i === 0) {
    $(el).attr('style', 'position:relative');
  } else if (i === 1) {
    $(el).attr('style', 'position:absolute;left:0px;top:80px');
  } else if (i === 2) {
    $(el).attr('style', 'position:absolute;left:0px;top:160px');
  } else if (i === 3) {
    $(el).attr('style', 'position:absolute;left:0px;top:240px');
  }
});

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Successfully cleaned pin-spacers and frozen styles!');
