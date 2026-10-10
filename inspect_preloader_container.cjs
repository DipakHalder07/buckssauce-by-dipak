const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let start = html.indexOf('id="bucks-preloader"');
let logoIdx = html.indexOf('data-logo', start);
console.log(html.slice(start - 100, logoIdx));
