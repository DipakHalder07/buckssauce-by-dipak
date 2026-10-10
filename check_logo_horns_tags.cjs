const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let logoIdx = html.indexOf('data-logo="true"');
let logoEnd = html.indexOf('</a>', logoIdx);
let logoSnippet = html.slice(logoIdx, logoEnd);

['head', 'left-horn', 'right-horn'].forEach(id => {
  let idx = logoSnippet.indexOf('id="' + id + '"');
  let tagEnd = logoSnippet.indexOf('>', idx);
  console.log(id, 'tag:', logoSnippet.slice(idx, tagEnd + 1));
});
