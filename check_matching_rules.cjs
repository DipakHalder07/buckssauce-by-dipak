const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_check_match_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9264',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9264/json');
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
              (function() {
                const circle = document.querySelector('[data-circle]');
                // Check all matching rules across stylesheets
                const matches = [];
                for (const sheet of document.styleSheets) {
                  try {
                    for (const rule of sheet.cssRules) {
                      if (rule.selectorText && circle.matches(rule.selectorText)) {
                        matches.push({ selector: rule.selectorText, cssText: rule.cssText });
                      }
                    }
                  } catch(e) {}
                }
                return {
                  className: circle?.className,
                  inlineStyle: circle?.getAttribute('style'),
                  computedWidth: window.getComputedStyle(circle).width,
                  matches
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Matching Rules for circle:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 1000);
