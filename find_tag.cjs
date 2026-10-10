const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('/src/interactive.js');
console.log(html.substring(idx - 100, idx + 100));
