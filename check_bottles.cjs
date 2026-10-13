const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_bottles_' + Date.now());
const outPath = path.resolve(__dirname, 'test_bottles.png');
try {
  execSync(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="${tmpDir}" --screenshot="${outPath}" --window-size=1200,600 "http://localhost:3000/test_bottles.html"`);
  console.log('Saved test_bottles.png');
} catch (e) {
  console.error(e);
}
