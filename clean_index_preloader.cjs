const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

const preloader = $('#bucks-preloader');
if (preloader.length) {
  preloader.attr('style', 'opacity: 1; pointer-events: all; display: block;');
  
  preloader.find('[data-circle]').each((i, el) => {
    $(el).removeAttr('style');
  });

  preloader.find('[data-food]').each((i, el) => {
    $(el).removeAttr('style');
  });

  fs.writeFileSync('index.html', $.html());
  console.log('Successfully cleaned #bucks-preloader in index.html');
} else {
  console.error('#bucks-preloader not found!');
}
