const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

const cspMeta = $('meta[http-equiv="content-security-policy"], meta[http-equiv="Content-Security-Policy"]');
console.log('CSP meta tags found:', cspMeta.length);
cspMeta.remove();

$('meta[name="referrer"]').remove();

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Removed CSP meta tags from index.html successfully!');
