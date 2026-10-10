const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_profile_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9222',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      // Scroll to Section 1
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `window.scrollTo(0, 1600);`,
            returnByValue: true
          }
        }));
      }, 1000);

      // Take screenshot
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Page.captureScreenshot'
        }));
      }, 2000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 3 && msg.result?.data) {
        fs.writeFileSync('tools/sec1_screenshot.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved sec1_screenshot.png');
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
