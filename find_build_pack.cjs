const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /build your own 3-pack/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  const start = Math.max(0, match.index - 80);
  const end = Math.min(html.length, match.index + 120);
  console.log('Match at', match.index, ':\n', html.substring(start, end), '\n---');
}

const regex2 = /save \$4/gi;
while ((match = regex2.exec(html)) !== null) {
  const start = Math.max(0, match.index - 80);
  const end = Math.min(html.length, match.index + 120);
  console.log('Save $4 match at', match.index, ':\n', html.substring(start, end), '\n---');
}
