const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_inspect_w_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9259',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9259/json');
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
                const preloader = document.getElementById('bucks-preloader');
                const wrapper = document.querySelector('[data-circles-wrapper]');
                const circle = document.querySelector('[data-circle]');
                return {
                  preloaderRect: preloader?.getBoundingClientRect(),
                  preloaderW: window.getComputedStyle(preloader).width,
                  preloaderH: window.getComputedStyle(preloader).height,
                  wrapperRect: wrapper?.getBoundingClientRect(),
                  wrapperW: window.getComputedStyle(wrapper).width,
                  wrapperH: window.getComputedStyle(wrapper).height,
                  circleStyleWidth: circle?.style.width,
                  circleComputedWidth: window.getComputedStyle(circle).width,
                  circleAppliedRules: Array.from(document.styleSheets).flatMap(s => {
                    try {
                      return Array.from(s.cssRules).filter(r => r.selectorText && (r.selectorText.includes('280%') || r.selectorText.includes('200%'))).map(r => r.cssText);
                    } catch(e) { return []; }
                  })
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
        console.log('Circle Width Debug:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
