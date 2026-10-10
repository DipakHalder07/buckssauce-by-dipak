const fs = require('fs');
let lines = fs.readFileSync('src/interactive.js', 'utf8').split('\n');
console.log(lines.slice(555, 675).map((l, i) => (i + 556) + ': ' + l).join('\n'));
