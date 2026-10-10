const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

// Find all main children or sections
const sectionMatches = html.match(/<(section|div data-banner|div data-page-content|footer|nav)[\s\S]*?>/gi);
console.log('Sections found:');
sectionMatches.slice(0, 30).forEach(s => console.log(s));

// Let's inspect the main tag content
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  const mainContent = mainMatch[1];
  // extract immediate children or major sections
  const sections = mainContent.match(/<section[^>]*>[\s\S]*?<\/section>/gi) || [];
  console.log(`\nFound ${sections.length} <section> elements in <main>:`);
  sections.forEach((sec, idx) => {
    const classAttr = sec.match(/class=\"([^\"]*)\"/i) || ['',''];
    const dataAttr = sec.match(/data-[a-z0-9-]+=\"[^\"]*\"|data-[a-z0-9-]+/gi) || [];
    const firstH = sec.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
    console.log(`Section ${idx + 1}: class="${classAttr[1]}" | data: ${dataAttr.join(' ')} | Heading: ${firstH ? firstH[1].replace(/<[^>]+>/g, '').trim() : 'none'}`);
  });
}
