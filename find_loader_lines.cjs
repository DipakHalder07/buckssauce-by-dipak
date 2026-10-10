const fs = require('fs');
let lines = fs.readFileSync('src/interactive.js', 'utf8').split('\n');

let start = lines.findIndex(l => l.includes('PAGE LOADER'));
let end = lines.findIndex(l => l.includes('runPageLoader();'));

console.log('start line:', start + 1, 'end line:', end + 1);
console.log(lines.slice(start, start + 20).join('\n'));
