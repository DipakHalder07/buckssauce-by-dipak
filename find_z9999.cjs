const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');

const idx = html.indexOf('z-9999');
console.log('Index:', idx);
if (idx !== -1) {
  console.log(html.substring(idx - 150, idx + 400));
}
