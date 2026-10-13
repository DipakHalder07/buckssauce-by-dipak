const fs = require('fs');

async function main() {
  const url = 'https://buckssauce.com/_next/static/chunks/5743dbfa7e19d97d.js';
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync('chunk_5743.js', text);
  console.log('Saved chunk_5743.js, len:', text.length);

  // Search around _draw
  const idx = text.indexOf('_draw');
  console.log('_draw slice:\n', text.slice(Math.max(0, idx - 200), Math.min(text.length, idx + 1500)));
}

main().catch(console.error);
