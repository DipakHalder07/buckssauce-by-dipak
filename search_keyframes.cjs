const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');

const keyframes = html.match(/@keyframes[^{]+{[^}]+}/g) || [];
console.log('Total keyframes:', keyframes.length);
keyframes.forEach((k, i) => {
  console.log(`Keyframe ${i}:`, k.substring(0, 100));
});

const z9999 = html.match(/[^{}]*z-9999[^{}]*{[^}]+}/g) || [];
console.log('z-9999 CSS rules:', z9999);
