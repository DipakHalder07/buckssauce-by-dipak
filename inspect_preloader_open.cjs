const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let start = html.indexOf('id="bucks-preloader"');
console.log(html.slice(start - 150, start + 30));
