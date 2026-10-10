const fs = require('fs');

let code = fs.readFileSync('src/components/Icons.jsx', 'utf8');

// Strip all style="..." completely from Icons.jsx
code = code.replace(/\sstyle="[^"]*"/g, '');
code = code.replace(/\sstyle=\{\s*\}\s*/g, '');

fs.writeFileSync('src/components/Icons.jsx', code);
console.log('Removed all string styles from src/components/Icons.jsx');
