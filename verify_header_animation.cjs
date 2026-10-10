const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_verify_header_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9245',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9245/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Wait 3.5s for page loader to finish
      setTimeout(async () => {
        // Step 1: Capture screenshot at scroll 0
        ws.send(JSON.stringify({
          id: 10,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 3500);
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10) {
        fs.writeFileSync('test_header_anim_scroll_0.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved test_header_anim_scroll_0.png');

        // Step 2: Scroll down to 300px
        ws.send(JSON.stringify({
          id: 11,
          method: 'Runtime.evaluate',
          params: { expression: 'window.scrollTo({ top: 300, behavior: "instant" });' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 12,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 800);
      } else if (msg.id === 12) {
        fs.writeFileSync('test_header_anim_scroll_300.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved test_header_anim_scroll_300.png');

        // Step 3: Scroll back up to 0px
        ws.send(JSON.stringify({
          id: 13,
          method: 'Runtime.evaluate',
          params: { expression: 'window.scrollTo({ top: 0, behavior: "instant" });' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 14,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 800);
      } else if (msg.id === 14) {
        fs.writeFileSync('test_header_anim_back_to_0.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved test_header_anim_back_to_0.png');

        // Check DOM state
        ws.send(JSON.stringify({
          id: 15,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const logo = document.querySelector('[data-logo]');
                const svg = logo?.querySelector('svg');
                const head = logo?.querySelector('#head');
                const text = logo?.querySelector('#text');
                const dNav = document.querySelector('[data-desktop-nav]');
                const gNav = document.querySelector('[data-global-nav]');
                return {
                  scrollY: window.scrollY,
                  logoH: logo?.style.height,
                  logoScale: window.getComputedStyle(logo).transform,
                  svgTransform: window.getComputedStyle(svg).transform,
                  headOpacity: window.getComputedStyle(head).opacity,
                  textOpacity: window.getComputedStyle(text).opacity,
                  dNavTransform: window.getComputedStyle(dNav).transform,
                  gNavTransform: window.getComputedStyle(gNav).transform
                };
              })()
            `,
            returnByValue: true
          }
        }));
      } else if (msg.id === 15) {
        console.log('Back to 0 DOM state:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
