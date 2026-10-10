const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let logoIdx = html.indexOf('data-logo="true"');
let logoEnd = html.indexOf('</a>', logoIdx);
let logoSnippet = html.slice(logoIdx, logoEnd);

['head', 'left-horn', 'right-horn'].forEach(id => {
  let idx = logoSnippet.indexOf('id="' + id + '"');
  if (idx !== -1) {
    console.log(id, ':', logoSnippet.slice(idx, idx + 80));
  } else {
    console.log(id, 'NOT FOUND in header logo');
  }
});
