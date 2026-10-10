const fs = require('fs');

function cleanHtml(filename) {
  if (!fs.existsSync(filename)) return 'File not found: ' + filename;
  let str = fs.readFileSync(filename, 'utf8');
  // replace base64 data:image/... with [IMG: length]
  str = str.replace(/data:image\/[a-zA-Z0-9+]+;base64,[A-Za-z0-9+/=]+/g, '[BASE64_IMG]');
  // replace long styles
  str = str.replace(/data-sf-[a-z0-9-]+=\"[^\"]*\"/g, '');
  return str;
}

for (let i = 1; i <= 6; i++) {
  const cleaned = cleanHtml(`part_section_${i}.html`);
  fs.writeFileSync(`clean_section_${i}.html`, cleaned);
  console.log(`clean_section_${i}.html: ${cleaned.length} chars`);
}

const cleanedHeader = cleanHtml('part_header.html');
fs.writeFileSync('clean_header.html', cleanedHeader);

const cleanedMenu = cleanHtml('part_menu.html');
fs.writeFileSync('clean_menu.html', cleanedMenu);

const cleanedCart = cleanHtml('part_cart.html');
fs.writeFileSync('clean_cart.html', cleanedCart);

const cleanedFooter = cleanHtml('part_footer.html');
fs.writeFileSync('clean_footer.html', cleanedFooter);

console.log('Done cleaning HTML!');
