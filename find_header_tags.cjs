const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let logoIdx = html.indexOf('data-logo="true"');
let logoTag = html.slice(logoIdx - 20, html.indexOf('>', logoIdx) + 1);
console.log('logoTag:', logoTag);

let svgIdx = html.indexOf('<svg', logoIdx);
let svgTag = html.slice(svgIdx, html.indexOf('>', svgIdx) + 1);
console.log('svgTag:', svgTag);

let textIdx = html.indexOf('id="text"', logoIdx);
let textTag = html.slice(textIdx, html.indexOf('>', textIdx) + 1);
console.log('textTag:', textTag);

let gNavIdx = html.indexOf('data-global-nav="true"');
let gNavTag = html.slice(gNavIdx - 20, html.indexOf('>', gNavIdx) + 1);
console.log('gNavTag:', gNavTag);
