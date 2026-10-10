const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let idx = html.indexOf('id="bucks-preloader"');
console.log(html.slice(idx - 30, idx + 1000));
