const fs = require('fs');

// Let's check sizes and any references
const html = fs.readFileSync('home.html', 'utf8');
for (let i = 7; i <= 17; i++) {
  const matches = (html.match(new RegExp(`img_${i}\\.avif`, 'g')) || []).length;
  console.log(`img_${i}.avif referenced ${matches} times in home.html`);
}
