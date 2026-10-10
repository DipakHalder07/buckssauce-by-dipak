const fs = require('fs');
const path = require('path');

const dir = path.join('src', 'components');
fs.readdirSync(dir).forEach(file => {
  const code = fs.readFileSync(path.join(dir, file), 'utf8');
  const matches = code.match(/style="[^"]*"/g) || [];
  if (matches.length > 0) {
    console.log(file, 'has string style props:', matches.length);
    console.log('Sample:', matches.slice(0, 5));
  }
});
