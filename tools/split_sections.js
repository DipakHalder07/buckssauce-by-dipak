const fs = require('fs');

const content = fs.readFileSync('body_structure.html', 'utf8');

// Find major blocks
function extractBetween(startTag, endTag) {
  const start = content.indexOf(startTag);
  if (start === -1) return null;
  const end = content.indexOf(endTag, start);
  if (end === -1) return null;
  return content.substring(start, end + endTag.length);
}

// 1. Header
const header = content.match(/<header[\s\S]*?<\/header>/i);
if (header) fs.writeFileSync('part_header.html', header[0]);

// 2. Menu drawer
const menu = content.match(/<nav[^>]*data-menu=true[\s\S]*?<\/nav>/i);
if (menu) fs.writeFileSync('part_menu.html', menu[0]);

// 3. Cart drawer
const cart = content.match(/<div[^>]*data-cart=true[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
// Better: find data-cart=true
const cartStart = content.indexOf('data-cart=true');
if (cartStart !== -1) {
  const cStartTag = content.lastIndexOf('<div', cartStart);
  // find backdrop or closing
  const cEnd = content.indexOf('data-banner=true', cStartTag);
  if (cEnd !== -1) {
    fs.writeFileSync('part_cart.html', content.substring(cStartTag, cEnd));
  }
}

// 4. Banner
const banner = content.match(/<div[^>]*data-banner=true[\s\S]*?<\/div>/i);
if (banner) fs.writeFileSync('part_banner.html', banner[0]);

// 5. Sections
const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  const main = mainMatch[1];
  const sections = main.match(/<section[\s\S]*?<\/section>/gi);
  if (sections) {
    sections.forEach((s, idx) => {
      fs.writeFileSync(`part_section_${idx + 1}.html`, s);
      console.log(`Saved part_section_${idx + 1}.html, length: ${s.length}`);
    });
  }
}

// 6. Footer
const footer = content.match(/<footer[\s\S]*?<\/footer>/i);
if (footer) fs.writeFileSync('part_footer.html', footer[0]);

console.log('Done extracting parts!');
