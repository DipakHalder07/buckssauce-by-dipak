const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_class_y_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9263',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9263/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                // Find all global functions or inspect canvas
                const c = document.querySelector('[data-home-hero] canvas');
                // Let's find properties on c
                const keys = Object.keys(c);
                const reactFiber = keys.find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));

                let fiberInfo = null;
                if (reactFiber && c[reactFiber]) {
                  let curr = c[reactFiber];
                  while (curr && !fiberInfo) {
                    if (curr.memoizedProps) {
                      fiberInfo = Object.keys(curr.memoizedProps);
                    }
                    curr = curr.return;
                  }
                }

                return {
                  keys,
                  reactFiber: !!reactFiber,
                  fiberInfo
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 5000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10) {
        console.log('Class Y inspection:');
        console.log(JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
