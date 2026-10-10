const fs = require('fs');
let html = fs.readFileSync('exact_live_header.html', 'utf8');

let logoIdx = html.indexOf('data-logo="true"');
let logoEnd = html.indexOf('</a>', logoIdx);
let logoSnippet = html.slice(logoIdx, logoEnd);

let logoTag = html.slice(logoIdx - 20, html.indexOf('>', logoIdx) + 1);
console.log('live logoTag:', logoTag);

let svgIdx = html.indexOf('<svg', logoIdx);
let svgTag = html.slice(svgIdx, html.indexOf('>', svgIdx) + 1);
console.log('live svgTag:', svgTag);

['text', 'head', 'left-horn', 'right-horn'].forEach(id => {
  let idx = logoSnippet.indexOf('id="' + id + '"');
  if (idx !== -1) {
    let tagEnd = logoSnippet.indexOf('>', idx);
    console.log('live', id, 'tag:', logoSnippet.slice(idx, tagEnd + 1));
  }
});
