const fs = require('fs');
const text = fs.readFileSync('exact_chunk_5743.js', 'utf8');

let idx = 0;
while ((idx = text.indexOf('_draw', idx)) !== -1) {
  console.log('--- MATCH AT', idx, '---');
  console.log(text.slice(Math.max(0, idx - 150), Math.min(text.length, idx + 800)));
  idx += 5;
}
