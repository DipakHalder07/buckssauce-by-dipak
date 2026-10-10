const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_check_' + Date.now());

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

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (() => {
                const shells = document.querySelectorAll('[data-bottle-shell]');
                const bottles = Array.from(shells).map(s => s.querySelector('[data-bottle]'));
                const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
                
                const before = {
                  shell0_display: shells[0]?.style.display,
                  shell1_display: shells[1]?.style.display,
                  bottle0_opacity: bottles[0]?.style.opacity,
                  bottle1_opacity: bottles[1]?.style.opacity,
                };

                arrows[1].click();

                const immediateAfter = {
                  shell0_display: shells[0]?.style.display,
                  shell1_display: shells[1]?.style.display,
                  bottle0_opacity: bottles[0]?.style.opacity,
                  bottle1_opacity: bottles[1]?.style.opacity,
                };

                return JSON.stringify({ before, immediateAfter });
              })()
            `,
            returnByValue: true
          }
        }));
      }, 1000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Result:', msg.result?.result?.value);
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
