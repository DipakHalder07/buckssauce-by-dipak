const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');

const regexes = [
  /class="[^"]*z-9999[^"]*"/g,
  /class="[^"]*h-dvh[^"]*"/g,
  /class="[^"]*clip-path[^"]*"/g
];

regexes.forEach(r => {
  const matches = html.match(r);
  console.log('Matches for', r, matches);
});
