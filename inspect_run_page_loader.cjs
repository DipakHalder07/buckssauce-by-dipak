const fs = require('fs');
let lines = fs.readFileSync('src/interactive.js', 'utf8').split('\n');
console.log(lines.slice(325, 485).map((l, i) => (i + 326) + ': ' + l).join('\n'));
