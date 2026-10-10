const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const additions = `
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.bg-theme {
  background-color: var(--color-theme, #ef8f4a) !important;
}

.text-theme {
  color: var(--color-theme, #ef8f4a) !important;
}

.border-theme {
  border-color: var(--color-theme, #ef8f4a) !important;
}

.group\\/button:hover .border-theme {
  border-color: var(--color-theme, #ef8f4a) !important;
}
`;

fs.writeFileSync('src/index.css', css + '\n' + additions);
console.log('Appended theme utilities and scroll keyframes to src/index.css');
