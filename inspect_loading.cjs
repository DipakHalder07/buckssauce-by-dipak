const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');

const matches = [];
let pos = 0;
while (true) {
  const found = html.toLowerCase().indexOf('loading', pos);
  if (found === -1) break;
  matches.push(html.substring(Math.max(0, found - 40), Math.min(html.length, found + 80)));
  pos = found + 7;
  if (matches.length > 15) break;
}

matches.forEach((m, i) => console.log(`${i}:`, m.replace(/\n/g, ' ')));
