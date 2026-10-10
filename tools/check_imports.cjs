const fs = require('fs');
const path = require('path');

const compDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(compDir);

const iconsFile = fs.readFileSync(path.join(compDir, 'Icons.jsx'), 'utf8');
const iconExports = new Set(
  (iconsFile.match(/export const ([a-zA-Z0-9_]+)/g) || []).map(s => s.replace('export const ', ''))
);
console.log('Available Icons:', Array.from(iconExports));

files.forEach(f => {
  if (f.endsWith('.jsx')) {
    const code = fs.readFileSync(path.join(compDir, f), 'utf8');
    // check imports from ./Icons
    const iconImportMatch = code.match(/import\s*\{([^}]+)\}\s*from\s*['"]\.\/Icons['"]/);
    if (iconImportMatch) {
      const imported = iconImportMatch[1].split(',').map(s => s.trim()).filter(Boolean);
      imported.forEach(iconName => {
        if (!iconExports.has(iconName)) {
          console.error(`ERROR in ${f}: Imported "${iconName}" does NOT exist in Icons.jsx!`);
        }
      });
    }
  }
});
console.log('Done checking icon imports.');
