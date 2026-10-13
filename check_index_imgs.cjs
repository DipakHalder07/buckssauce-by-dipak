const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
for (let i = 1; i <= 50; i++) {
  const matches = (html.match(new RegExp(`img_${i}[._]`, 'g')) || []).length;
  if (matches > 0) {
    console.log(`img_${i} matches ${matches} times in index.html`);
  }
}
