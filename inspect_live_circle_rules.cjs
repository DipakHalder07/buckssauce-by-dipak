const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_rules_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9260',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9260/json');
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
              (function() {
                const circle = document.querySelector('[data-circle-gold]');
                return {
                  computedW: window.getComputedStyle(circle).width,
                  computedH: window.getComputedStyle(circle).height,
                  aspectRatio: window.getComputedStyle(circle).aspectRatio,
                  rules: Array.from(document.styleSheets).flatMap(s => {
                    try {
                      return Array.from(s.cssRules).filter(r => r.selectorText && (r.selectorText.includes('280%') || r.selectorText.includes('200%') || r.selectorText.includes('400%'))).map(r => r.cssText);
                    } catch(e) { return []; }
                  })
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 3000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Live Circle CSS Rules:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
