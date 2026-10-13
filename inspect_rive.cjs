const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('[data-front-fruits] [data-fruit]').each((i, el) => {
  console.log(`\n=== Fruit ${i} ===`);
  console.log('Fruit HTML:');
  const clone = $(el).clone();
  clone.find('img').attr('src', '[IMG]');
  console.log(clone.html());
});

// Search for .riv in home.html, index.html, exact_live_body.html, or node_modules
const files = ['home.html', 'index.html', 'exact_live_body.html'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const rivMatches = content.match(/[\w\-./\\]+\.riv/gi);
    console.log(`\n.riv in ${f}:`, rivMatches);
  }
});
