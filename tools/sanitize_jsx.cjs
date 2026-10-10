const fs = require('fs');

let code = fs.readFileSync('src/components/Icons.jsx', 'utf8');

// Replace class= with className=
code = code.replace(/\bclass=/g, 'className=');

// Replace style="fill:none;..." with style={{...}} or remove style if not needed
code = code.replace(/style="([^"]*)"/g, (match, styleStr) => {
  const rules = styleStr.split(';').filter(Boolean).map(r => {
    const [k, v] = r.split(':');
    if (!k || !v) return '';
    const camelK = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return `${camelK}: "${v.trim()}"`;
  }).filter(Boolean).join(', ');
  return `style={{ ${rules} }}`;
});

// Replace SVG kebab-case attributes to camelCase
const svgAttrs = [
  'clip-rule', 'fill-rule', 'fill-opacity', 'stroke-width', 'stroke-linecap',
  'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
  'stroke-opacity', 'stop-color', 'stop-opacity', 'color-interpolation-filters',
  'xmlns:xlink', 'xlink:href'
];

svgAttrs.forEach(attr => {
  const camel = attr.replace('xmlns:xlink', 'xmlnsXlink')
                    .replace('xlink:href', 'xlinkHref')
                    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const regex = new RegExp(`\\b${attr}=`, 'g');
  code = code.replace(regex, `${camel}=`);
});

fs.writeFileSync('src/components/Icons.jsx', code);
console.log('Sanitized src/components/Icons.jsx successfully!');
