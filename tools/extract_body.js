const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

// Find the body tag
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.log('No body found');
  process.exit(1);
}

const bodyContent = bodyMatch[1];
fs.writeFileSync('clean_body.html', bodyContent);
console.log('clean_body.html written, length:', bodyContent.length);

// Let's inspect top-level divs inside body
const topDivs = bodyContent.match(/<([a-z0-9-]+)[^>]*>/gi);
console.log('Top elements count:', topDivs ? topDivs.length : 0);
