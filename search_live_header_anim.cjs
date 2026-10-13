const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.js') || f.endsWith('.cjs'));
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('data-nav') || content.includes('translate-y-[200px]')) {
    console.log('Match in:', file);
  }
}
