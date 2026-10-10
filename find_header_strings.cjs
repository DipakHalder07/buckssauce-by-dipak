const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let logoIdx = html.indexOf('data-logo="true"');
console.log('Logo snippet:', html.slice(logoIdx - 20, logoIdx + 180));

let svgIdx = html.indexOf('<svg', logoIdx);
console.log('SVG snippet:', html.slice(svgIdx, svgIdx + 200));

let textIdx = html.indexOf('id="text"', logoIdx);
console.log('Text snippet:', html.slice(textIdx, textIdx + 100));

let gNavIdx = html.indexOf('data-global-nav="true"');
console.log('Global nav snippet:', html.slice(gNavIdx - 20, gNavIdx + 200));
