const fs = require('fs');
const text = fs.readFileSync('exact_chunk_5743.js', 'utf8');

const start = 327600;
console.log(text.slice(start, start + 3000));
