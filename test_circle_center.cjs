const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_circle_center_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9293',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9293/json');
    const pages = await res.json();
    const ws = new WebSocket(pages[0].webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const cGold = document.querySelector('[data-circle-gold]');
                const cOrange = document.querySelector('[data-circle-orange]');
                const rectGold = cGold ? cGold.getBoundingClientRect() : null;
                return {
                  goldStyle: cGold?.getAttribute('style'),
                  goldTransform: cGold ? getComputedStyle(cGold).transform : null,
                  goldRect: rectGold ? {
                    top: rectGold.top,
                    left: rectGold.left,
                    width: rectGold.width,
                    height: rectGold.height,
                    centerX: rectGold.left + rectGold.width / 2,
                    centerY: rectGold.top + rectGold.height / 2
                  } : null
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Result at 500ms:', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}, 1000);
