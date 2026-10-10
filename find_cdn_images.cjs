const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const urls = [...html.matchAll(/https?:\/\/[^\s"'()<>]+/g)].map(m => m[0]);
const imgUrls = urls.filter(u => u.match(/\.(png|jpe?g|webp|avif|svg|gif)(\?|$)/i) || u.includes('cdn') || u.includes('prismic') || u.includes('images'));

console.log('Total URLs found:', urls.length);
console.log('Image / CDN URLs found:', imgUrls.length);

const unique = [...new Set(imgUrls)];
console.log('Unique image / CDN URLs:');
unique.forEach(u => console.log(' - ' + u));

// Also check all <img> tags in index.html
const cheerio = require('cheerio');
const $ = cheerio.load(html);
console.log('\n--- <img> SRC analysis ---');
let cdnCount = 0;
let localCount = 0;
let dataUriCount = 0;

$('img').each((i, el) => {
  const src = $(el).attr('src') || '';
  if (src.startsWith('data:')) {
    dataUriCount++;
  } else if (src.startsWith('http://') || src.startsWith('https://')) {
    cdnCount++;
    console.log(`[CDN] img ${i}:`, src.slice(0, 100));
  } else {
    localCount++;
    console.log(`[LOCAL] img ${i}:`, src);
  }
});

console.log(`Summary: ${cdnCount} CDN images, ${localCount} local images, ${dataUriCount} data-uri images.`);
