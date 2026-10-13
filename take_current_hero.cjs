const { execSync } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_3000_' + Date.now());
const outImg = path.join(__dirname, 'current_local_hero.png');

try {
  const cmd = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="${tmpDir}" --screenshot="${outImg}" --window-size=1440,900 --virtual-time-budget=5000 "http://localhost:3000/"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('Current localhost:3000 screenshot taken!');
} catch (err) {
  console.error(err);
}
