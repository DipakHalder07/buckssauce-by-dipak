const fs = require('fs');

const sec1 = fs.readFileSync('tools/clean_section_1.html', 'utf8');

const fruitMatches = sec1.matchAll(/data-fruit=true[^>]*class="([^"]*)"/gi);
for (const m of fruitMatches) {
  console.log('Original Fruit Class:', m[1]);
}
