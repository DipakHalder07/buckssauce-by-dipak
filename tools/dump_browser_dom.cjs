const { execSync } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_profile');

try {
  const output = execSync(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --user-data-dir="${tmpDir}" --dump-dom --virtual-time-budget=5000 http://localhost:5173/`, { encoding: 'utf8' });
  console.log('DOM length:', output.length);
  console.log('Snippet of root:\n', output.substring(output.indexOf('<div id="root">'), output.indexOf('<div id="root">') + 1000));
} catch (err) {
  console.error('Error:', err.message);
}
