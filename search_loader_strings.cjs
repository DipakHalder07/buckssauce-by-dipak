const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');

const matches = [];
let pos = 0;
while (true) {
  const found = html.toLowerCase().indexOf('loader', pos);
  if (found === -1) break;
  matches.push(html.substring(Math.max(0, found - 60), Math.min(html.length, found + 100)));
  pos = found + 6;
  if (matches.length > 20) break;
}

console.log('Loader occurrences:', matches.length);
matches.forEach((m, i) => console.log(`${i}:`, m.replace(/\n/g, ' ')));
