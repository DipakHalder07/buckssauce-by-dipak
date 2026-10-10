const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_header_full_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9252',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9252/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Wait 3.5s for loader to finish on live site
      setTimeout(async () => {
        // 1. Capture Header at scroll 0
        ws.send(JSON.stringify({
          id: 10,
          method: 'Page.captureScreenshot',
          params: {
            format: 'png',
            clip: { x: 0, y: 0, width: 1440, height: 180, scale: 1 }
          }
        }));

        // 2. Extract Header HTML and detailed styles
        ws.send(JSON.stringify({
          id: 20,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const header = document.querySelector('header');
                return {
                  outerHTML: header ? header.outerHTML : 'Not found',
                  computed: header ? {
                    position: window.getComputedStyle(header).position,
                    top: window.getComputedStyle(header).top,
                    left: window.getComputedStyle(header).left,
                    width: window.getComputedStyle(header).width,
                    height: window.getComputedStyle(header).height,
                    backgroundColor: window.getComputedStyle(header).backgroundColor,
                    backdropFilter: window.getComputedStyle(header).backdropFilter,
                    transform: window.getComputedStyle(header).transform,
                    zIndex: window.getComputedStyle(header).zIndex
                  } : null
                };
              })()
            `,
            returnByValue: true
          }
        }));

        // 3. Scroll down 400px
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 30,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (async function() {
                  window.scrollTo({ top: 400, behavior: 'instant' });
                  await new Promise(r => setTimeout(r, 600));
                  const header = document.querySelector('header');
                  return {
                    computed: header ? {
                      position: window.getComputedStyle(header).position,
                      top: window.getComputedStyle(header).top,
                      backgroundColor: window.getComputedStyle(header).backgroundColor,
                      backdropFilter: window.getComputedStyle(header).backdropFilter,
                      transform: window.getComputedStyle(header).transform
                    } : null
                  };
                })()
              `,
              awaitPromise: true,
              returnByValue: true
            }
          }));
        }, 1000);

        // 4. Capture Header at scroll 400
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 40,
            method: 'Page.captureScreenshot',
            params: {
              format: 'png',
              clip: { x: 0, y: 0, width: 1440, height: 180, scale: 1 }
            }
          }));
        }, 1800);

        setTimeout(() => {
          chrome.kill();
          process.exit(0);
        }, 3000);

      }, 3500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'live_header_scroll_0.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved live_header_scroll_0.png');
      }
      if (msg.id === 20) {
        const val = msg.result?.result?.value;
        fs.writeFileSync(path.join(__dirname, 'exact_live_header.html'), val.outerHTML || '');
        console.log('Saved exact_live_header.html! Length:', (val.outerHTML || '').length);
        console.log('Computed at scroll 0:\n', JSON.stringify(val.computed, null, 2));
      }
      if (msg.id === 30) {
        console.log('Computed at scroll 400:\n', JSON.stringify(msg.result?.result?.value?.computed, null, 2));
      }
      if (msg.id === 40 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'live_header_scroll_400.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved live_header_scroll_400.png');
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
