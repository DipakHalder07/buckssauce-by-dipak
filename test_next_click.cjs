const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_click_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9256',
  'http://localhost:3000/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9256/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:3000'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

      // Wait 5 seconds for preloader
      setTimeout(() => {
        // Click Next arrow
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
              console.log('Arrows found:', arrows.length);
              if (arrows[1]) arrows[1].click();
            `
          }
        }));

        // Wait 1.5s after click and take screenshot
        setTimeout(() => {
          const handler = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.id === 20 && msg.result?.data) {
              fs.writeFileSync('hero_after_next_click.png', Buffer.from(msg.result.data, 'base64'));
              console.log('Saved hero_after_next_click.png');
              ws.removeEventListener('message', handler);
              chrome.kill();
              process.exit(0);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id: 20, method: 'Page.captureScreenshot' }));
        }, 1500);
      }, 5000);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
