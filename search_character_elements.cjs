const fs = require('fs');
const html = fs.readFileSync('exact_live_body.html', 'utf8');

console.log('Searching exact_live_body.html...');
const keywords = ['sunglass', 'face', 'mouth', 'eye', 'smile', 'character', 'cartoon', 'lottie', 'svg', 'canvas', 'spline', 'rive'];
for (const kw of keywords) {
  const matches = (html.match(new RegExp(kw, 'gi')) || []).length;
  console.log(`${kw}: ${matches} matches`);
}
