const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('[data-home-hero] [data-bottle-shell]').each((i, el) => {
  const img = $(el).find('img');
  const src = img.attr('src');
  if (src && src.startsWith('data:')) {
    const buf = Buffer.from(src.split(',')[1], 'base64');
    fs.writeFileSync(`home_bottle_${i}.avif`, buf);
    console.log(`Saved home_bottle_${i}.avif, size: ${buf.length}`);
  }
});
