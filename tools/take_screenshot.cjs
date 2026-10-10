const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_profile');
const outImg = path.join(__dirname, 'test_screen.png');

try {
  const cmd = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="${tmpDir}" --screenshot="${outImg}" --window-size=1440,900 --virtual-time-budget=6000 http://localhost:5173/`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('Screenshot success!');
  console.log('File exists:', fs.existsSync(outImg));
  if (fs.existsSync(outImg)) {
    console.log('Size:', fs.statSync(outImg).size, 'bytes');
  }
} catch (err) {
  console.error('Chrome error:', err.message);
}
