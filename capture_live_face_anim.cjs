const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_face_anim_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9259',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9259/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

      // Wait 5s for preloader to complete
      setTimeout(async () => {
        // Find how the canvas is updated or what is drawing to it
        ws.send(JSON.stringify({
          id: 5,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const c = document.querySelector('[data-home-hero] canvas');
                if (!c) return 'No canvas found in hero';
                const ctx = c.getContext('2d');
                return {
                  canvasWidth: c.width,
                  canvasHeight: c.height,
                  canvasStyle: c.style.cssText,
                  parentStyle: c.parentElement?.style?.cssText,
                  grandParentStyle: c.parentElement?.parentElement?.style?.cssText,
                  hasDataUrl: c.toDataURL().slice(0, 50)
                };
              })()
            `,
            returnByValue: true
          }
        }));

        // Take 4 screenshots spaced 300ms apart focusing on the front fruit
        for (let frame = 0; frame < 4; frame++) {
          await new Promise(r => setTimeout(r, 400));
          await new Promise(resolve => {
            const handler = (event) => {
              const msg = JSON.parse(event.data);
              if (msg.id === 200 + frame && msg.result?.data) {
                fs.writeFileSync(`live_face_frame_${frame}.png`, Buffer.from(msg.result.data, 'base64'));
                console.log(`Saved live_face_frame_${frame}.png`);
                ws.removeEventListener('message', handler);
                resolve();
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({
              id: 200 + frame,
              method: 'Page.captureScreenshot',
              params: {
                clip: {
                  x: 350,
                  y: 500,
                  width: 350,
                  height: 350,
                  scale: 1
                }
              }
            }));
          });
        }

        chrome.kill();
        process.exit(0);
      }, 5000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 5) {
        console.log('Canvas eval result:', msg.result?.result?.value);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
