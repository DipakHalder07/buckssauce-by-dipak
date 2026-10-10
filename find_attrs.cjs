const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);

const results = [];
$('*').each((i, el) => {
  const attribs = el.attribs || {};
  Object.keys(attribs).forEach(attr => {
    if (attr.startsWith('data-gsap') || attr.startsWith('data-scroll') || attr.startsWith('data-parallax') || attr.startsWith('data-antler') || attr.startsWith('data-listing') || attr.startsWith('data-nav') || attr.includes('banner')) {
      results.push({
        attr,
        value: attribs[attr],
        tag: el.tagName,
        text: $(el).text().trim().slice(0, 40),
        classes: (attribs.class || '').slice(0, 50)
      });
    }
  });
});
console.log(JSON.stringify(results, null, 2));
