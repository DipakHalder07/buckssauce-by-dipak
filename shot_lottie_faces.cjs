const { execSync } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_lottie_shot_' + Date.now());
const outPath = path.resolve(__dirname, 'test_lottie_faces_result.png');

try {
  execSync(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="${tmpDir}" --screenshot="${outPath}" --window-size=1200,500 --virtual-time-budget=2000 "http://localhost:3000/test_lottie_faces.html"`);
  console.log('Saved test_lottie_faces_result.png');
} catch (e) {
  console.error(e);
}
