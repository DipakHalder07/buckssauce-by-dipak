const { execSync } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_home_profile_' + Date.now());
const homeHtmlPath = path.resolve(__dirname, 'home.html');
const outImg = path.join(__dirname, 'original_full_page.png');

try {
  const cmd = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="${tmpDir}" --screenshot="${outImg}" --window-size=1440,5000 --virtual-time-budget=6000 "file:///${homeHtmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('Original full page screenshot taken!');
} catch (err) {
  console.error(err);
}
