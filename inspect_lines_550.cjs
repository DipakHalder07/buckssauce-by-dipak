const fs = require('fs');
let lines = fs.readFileSync('src/interactive.js', 'utf8').split('\n');
console.log(lines.slice(540, 565).map((l, i) => (i + 541) + ': ' + l).join('\n'));
