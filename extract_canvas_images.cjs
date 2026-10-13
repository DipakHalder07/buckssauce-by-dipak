const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));

$('[data-front-fruits] [data-fruit]').each((i, el) => {
  const canvas = $(el).find('canvas');
  if (canvas.length) {
    const style = canvas.attr('style') || '';
    const match = style.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
    if (match) {
      const buffer = Buffer.from(match[1], 'base64');
      fs.writeFileSync(`canvas_face_${i}.png`, buffer);
      console.log(`Saved canvas_face_${i}.png, size: ${buffer.length} bytes`);
    } else {
      console.log(`Fruit ${i} canvas has no base64 match. Style:`, style.slice(0, 100));
    }
  }
});
