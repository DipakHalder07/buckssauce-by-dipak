const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_profile_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
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
      // Click next arrow
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              const arrows = document.querySelectorAll('[data-slider-arrow]');
              if (arrows.length > 1) {
                arrows[1].click();
                'Clicked next arrow!';
              } else {
                'Arrow not found';
              }
            `,
            returnByValue: true
          }
        }));
      }, 1000);

      // Take screenshot after 2 seconds
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Page.captureScreenshot'
        }));
      }, 2000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Click result:', msg.result?.result?.value);
      }
      if (msg.id === 3 && msg.result?.data) {
        fs.writeFileSync('tools/after_click_screenshot.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved after_click_screenshot.png');
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
