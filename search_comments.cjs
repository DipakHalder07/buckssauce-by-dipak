const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');

const commentMatches = html.match(/<!--[\s\S]*?-->/g) || [];
console.log('Total comments:', commentMatches.length);
commentMatches.forEach((c, i) => {
  if (c.toLowerCase().includes('load') || c.toLowerCase().includes('script') || c.toLowerCase().includes('preloader') || c.toLowerCase().includes('bucks')) {
    console.log(`Comment ${i} (len=${c.length}):`, c.substring(0, 150).replace(/\n/g, ' '));
  }
});
