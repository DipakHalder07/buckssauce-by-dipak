const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const sfMatches = [...html.matchAll(/--sf-img-(\d+):\s*url\(["']?(data:image\/[^"')]+)["']?\)/g)];
console.log('Total --sf-img variables in <style>:', sfMatches.length);
sfMatches.forEach(m => {
  console.log(`--sf-img-${m[1]}: length ${m[2].length}`);
});
