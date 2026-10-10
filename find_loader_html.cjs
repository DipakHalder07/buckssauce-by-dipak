const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');

let idx = html.indexOf('class="fixed top-0 left-0 w-full h-dvh z-9999');
console.log('HTML Index:', idx);
if (idx !== -1) {
  console.log(html.substring(idx - 100, idx + 500));
}
