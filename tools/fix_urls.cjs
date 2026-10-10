const fs = require('fs');

let code = fs.readFileSync('src/components/Icons.jsx', 'utf8');

// Fix unquoted xmlns or any url attribute
code = code.replace(/xmlns=http:\/\/www\.w3\.org\/2000\/svg/g, 'xmlns="http://www.w3.org/2000/svg"');
code = code.replace(/xmlns:xlink=http:\/\/www\.w3\.org\/1999\/xlink/g, 'xmlnsXlink="http://www.w3.org/1999/xlink"');

// Fix any unquoted attribute value
code = code.replace(/(\s[a-zA-Z0-9_-]+)=([^"\s>}{]+)([\s>])/g, (match, attr, val, end) => {
  if (val.startsWith('"') || val.startsWith('{') || val.startsWith("'")) return match;
  return `${attr}="${val}"${end}`;
});

fs.writeFileSync('src/components/Icons.jsx', code);
console.log('Fixed URLs and attributes in Icons.jsx');
