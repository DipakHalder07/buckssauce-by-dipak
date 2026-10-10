const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_inspect_f722_2_' + Date.now());

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
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async function() {
                const url = 'https://buckssauce.com/_next/static/chunks/ada798cc8a794786.js?dpl=dpl_9ZZA3NxAiGDkunrFn3uhJ92DoT2i';
                const text = await (await fetch(url)).text();
                const idx = text.indexOf('data-circles-wrapper');
                // Return 3000 chars before and 3000 chars after
                return text.slice(Math.max(0, idx - 3000), idx + 2500);
              })()
            `,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      }, 4000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        fs.writeFileSync('live_preloader_full_code.js', msg.result?.result?.value);
        console.log('Saved live_preloader_full_code.js');
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
