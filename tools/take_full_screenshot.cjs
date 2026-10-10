const { execSync } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_profile_' + Date.now());
const outImg = path.join(__dirname, 'full_page.png');

try {
  const cmd = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="${tmpDir}" --screenshot="${outImg}" --window-size=1440,3200 --virtual-time-budget=8000 http://localhost:5173/`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('Full page screenshot success!');
} catch (err) {
  console.error(err);
}
