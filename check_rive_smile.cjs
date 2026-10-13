const fs = require('fs');
const html = fs.readFileSync('exact_live_body.html', 'utf8');

function showContext(word) {
  let idx = 0;
  console.log(`\n=== Matches for "${word}" ===`);
  while ((idx = html.toLowerCase().indexOf(word.toLowerCase(), idx)) !== -1) {
    console.log(html.slice(Math.max(0, idx - 150), Math.min(html.length, idx + 150)));
    console.log('---');
    idx += word.length;
  }
}

showContext('rive');
showContext('smile');
