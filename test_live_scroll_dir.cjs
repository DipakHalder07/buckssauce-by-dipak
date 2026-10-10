const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_scroll_dir_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9238',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9238/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async function() {
                // Scroll down to 1500
                window.scrollTo({ top: 1500, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));

                const header = document.querySelector('header');
                const gNav = document.querySelector('[data-global-nav]');

                const at1500 = {
                  headerTransform: window.getComputedStyle(header).transform,
                  gNavTransform: window.getComputedStyle(gNav).transform,
                  gNavOpacity: window.getComputedStyle(gNav).opacity,
                };

                // Scroll down a bit more to 1800
                window.scrollTo({ top: 1800, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));

                const at1800 = {
                  headerTransform: window.getComputedStyle(header).transform,
                };

                // Scroll up from 1800 to 1400
                window.scrollTo({ top: 1400, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));

                const at1400Up = {
                  headerTransform: window.getComputedStyle(header).transform,
                };

                return { at1500, at1800, at1400Up };
              })()
            `,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      }, 5000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Scroll Direction Test:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
