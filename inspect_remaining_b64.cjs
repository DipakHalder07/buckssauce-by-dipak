const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const regex = /data:image\/[^"'\s>)]+/g;
let m;
let i = 0;
while ((m = regex.exec(html)) !== null) {
  i++;
  const start = Math.max(0, m.index - 80);
  const end = Math.min(html.length, m.index + m[0].length + 40);
  const context = html.slice(start, m.index) + `[BASE64 ${m[0].length} chars]` + html.slice(m.index + m[0].length, end);
  console.log(`Match #${i}: ${context.replace(/\s+/g, ' ')}`);
}
