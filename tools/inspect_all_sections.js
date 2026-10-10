const fs = require('fs');

console.log('--- SECTION 2 ---');
const sec2 = fs.readFileSync('clean_section_2.html', 'utf8');
const cards2 = sec2.match(/data-card=true[\s\S]*?(?=data-card=true|<\/section>)/gi) || [];
cards2.forEach((c, idx) => {
  const text = c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Card ${idx + 1}:`, text);
});

console.log('\n--- SECTION 3 ---');
const sec3 = fs.readFileSync('clean_section_3.html', 'utf8');
const cards3 = sec3.match(/data-listing-card=true[\s\S]*?(?=data-listing-card=true|<\/section>)/gi) || [];
cards3.forEach((c, idx) => {
  const title = c.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const price = c.match(/\$\d+(\.\d{2})?/i);
  const text = c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Listing ${idx + 1}: Title: ${title ? title[1] : 'none'}, Price: ${price ? price[0] : 'none'}`);
});

console.log('\n--- SECTION 4 ---');
const sec4 = fs.readFileSync('clean_section_4.html', 'utf8');
console.log('Sec 4 text:', sec4.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

console.log('\n--- SECTION 5 ---');
const sec5 = fs.readFileSync('clean_section_5.html', 'utf8');
const reasons = sec5.match(/data-reason=true[\s\S]*?(?=data-reason=true|<\/section>)/gi) || [];
reasons.forEach((r, idx) => {
  console.log(`Reason ${idx + 1}:`, r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
});

console.log('\n--- SECTION 6 ---');
const sec6 = fs.readFileSync('clean_section_6.html', 'utf8');
const reviews = sec6.match(/data-review-card=true[\s\S]*?(?=data-review-card=true|<\/section>)/gi) || [];
console.log(`Total Reviews: ${reviews.length}`);
reviews.slice(0, 5).forEach((r, idx) => {
  console.log(`Review ${idx + 1}:`, r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
});

