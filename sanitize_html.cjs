const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Fix unquoted attributes in HTML tags
// E.g., <div style=transform:... id=foo class=bar>
// We can use a regex on tag attributes
html = html.replace(/<([a-zA-Z0-9-]+)(\s+[^>]+)>/g, (match, tag, attrs) => {
  // Fix attributes that are unquoted: name=value where value doesn't start with " or '
  // Be careful with spaces between attributes
  let fixedAttrs = attrs.replace(/(\s[a-zA-Z0-9_:-]+)=([^"'\s>]+)/g, (m, name, val) => {
    return `${name}="${val}"`;
  });
  return `<${tag}${fixedAttrs}>`;
});

// Also fix any style attributes where there might be unquoted strings
html = html.replace(/\sstyle=([^"'\s>]+)/g, ' style="$1"');

fs.writeFileSync('index.html', html);
console.log('Sanitized index.html attributes!');
