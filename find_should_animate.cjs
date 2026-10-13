const fs = require('fs');
const text = fs.readFileSync('exact_chunk_5743.js', 'utf8');

let idx = 0;
while ((idx = text.indexOf('shouldAnimate', idx)) !== -1) {
  console.log('--- shouldAnimate MATCH AT', idx, '---');
  console.log(text.slice(Math.max(0, idx - 100), Math.min(text.length, idx + 400)));
  idx += 13;
}
