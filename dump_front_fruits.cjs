const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('[data-front-fruits] [data-fruit]').each((i, el) => {
  console.log(`\n=================== FRONT FRUIT ${i} ===================`);
  console.log($(el).prop('outerHTML'));
});
