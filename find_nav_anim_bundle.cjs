const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_bundle4_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9242',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9242/json');
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
                const url = 'https://buckssauce.com/_next/static/chunks/388c8b79f4bf6619.js?dpl=dpl_9ZZA3NxAiGDkunrFn3uhJ92DoT2i';
                const text = await (await fetch(url)).text();
                // Find all occurrences of ScrollTrigger or where globalNav / desktopNav is animated
                const matches = [];
                let pos = 0;
                while ((pos = text.indexOf('data-global-nav', pos)) !== -1) {
                  matches.push(text.slice(Math.max(0, pos - 200), pos + 300));
                  pos += 15;
                }
                while ((pos = text.indexOf('data-desktop-nav', pos)) !== -1) {
                  matches.push(text.slice(Math.max(0, pos - 200), pos + 300));
                  pos += 16;
                }
                return matches;
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
        console.log('Matches:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
