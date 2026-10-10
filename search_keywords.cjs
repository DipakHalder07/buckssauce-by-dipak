const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');

['loading', 'preloader', 'intro', 'curtain', 'overlay', 'entrance'].forEach(word => {
  let count = 0;
  let pos = 0;
  while (true) {
    const found = html.toLowerCase().indexOf(word, pos);
    if (found === -1) break;
    count++;
    pos = found + word.length;
  }
  console.log(`Word "${word}": count=${count}`);
});
