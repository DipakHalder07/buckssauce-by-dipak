const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_debug_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
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
      ws.send(JSON.stringify({ id: 2, method: 'Console.enable' }));

      // Check what arrow elements exist and test clicking
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (() => {
                const allArrows = document.querySelectorAll('[data-slider-arrow]');
                const heroArrows = Array.from(allArrows).filter(a => a.closest('[data-home-hero]'));
                console.log('allArrows count:', allArrows.length, 'heroArrows count:', heroArrows.length);
                if (heroArrows.length >= 2) {
                  console.log('Attempting to click heroArrows[1]...');
                  heroArrows[1].click();
                  return 'Clicked heroArrows[1]';
                }
                return 'heroArrows not found';
              })()
            `,
            returnByValue: true
          }
        }));
      }, 1500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Console.messageAdded' || msg.method === 'Runtime.consoleAPICalled') {
        console.log('Browser log:', msg.params?.message?.text || msg.params?.args?.[0]?.value);
      }
      if (msg.id === 3) {
        console.log('Eval return:', msg.result?.result?.value);
      }
    };

    setTimeout(() => {
      chrome.kill();
      process.exit(0);
    }, 4500);

  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
