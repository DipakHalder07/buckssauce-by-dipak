const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

console.log('Occurrences of !important;"" :', (html.match(/!important;""/g) || []).length);
html = html.replace(/!important;""/g, '!important;"');

// Also check for any other pattern like ;"" or style="..." width=
html = html.replace(/;""\s+/g, ';" ');

fs.writeFileSync('index.html', html);
console.log('Cleaned up style attribute double quotes!');
