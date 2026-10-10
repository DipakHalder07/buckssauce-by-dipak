const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const bgRegex = /background(-image)?:\s*url\((data:image\/[^)]+)\)/g;
let m;
let count = 0;
while ((m = bgRegex.exec(html)) !== null) {
  count++;
  console.log(`BG #${count}: ${m[2].slice(0, 50)}... length ${m[2].length}`);
}
