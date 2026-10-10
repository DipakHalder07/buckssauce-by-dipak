const fs = require('fs');

let code = fs.readFileSync('src/components/Icons.jsx', 'utf8');

// Replace unquoted attributes like fill=#100B06, stroke=#..., etc.
code = code.replace(/=([#a-zA-Z0-9_.-]+)([\s>])/g, (match, val, ending) => {
  if (val.startsWith('"') || val.startsWith('{') || val.startsWith("'")) {
    return match;
  }
  return `="${val}"${ending}`;
});

// Also make sure xmlns:xlink is xmlnsXlink
code = code.replace(/xmlns:xlink=/g, 'xmlnsXlink=');
code = code.replace(/xlink:href=/g, 'xlinkHref=');
code = code.replace(/fill-rule=/g, 'fillRule=');
code = code.replace(/clip-rule=/g, 'clipRule=');
code = code.replace(/stroke-width=/g, 'strokeWidth=');
code = code.replace(/stroke-linecap=/g, 'strokeLinecap=');
code = code.replace(/stroke-linejoin=/g, 'strokeLinejoin=');

fs.writeFileSync('src/components/Icons.jsx', code);
console.log('Fixed unquoted attributes in src/components/Icons.jsx');
