const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

$('[data-bottle-shell]').each((i, el) => {
  console.log('Shell', i, 'style:', $(el).attr('style'));
  const bottle = $(el).find('[data-bottle]');
  console.log('  Bottle style:', bottle.attr('style'));
});
