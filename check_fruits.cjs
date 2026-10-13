const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<body style="background: #222; display: flex; flex-wrap: wrap; gap: 20px; padding: 20px;">
  ${[11, 12, 13, 14, 15, 16, 17].map(n => `
    <div style="text-align: center; color: white;">
      <h3>img_${n}</h3>
      <img src="/images/img_${n}.avif" width="150" />
    </div>
  `).join('')}
</body>
</html>
`;

fs.writeFileSync('public/test_fruits.html', html);

const tmpDir = path.join(process.env.TEMP, 'chrome_test_fruits_' + Date.now());
const outPath = path.resolve(__dirname, 'test_fruits.png');
try {
  execSync(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="${tmpDir}" --screenshot="${outPath}" --window-size=1200,600 "http://localhost:3000/test_fruits.html"`);
  console.log('Saved test_fruits.png');
} catch (e) {
  console.error(e);
}
