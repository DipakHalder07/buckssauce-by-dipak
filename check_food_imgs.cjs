const fs = require('fs');

['home.html', 'index.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`=== ${file} ===`);
  ['pineapple-2', 'habanero-2', 'cherry-2', 'peach-2'].forEach(name => {
    console.log(`  ${name}: ${content.includes(name)}`);
  });
});
