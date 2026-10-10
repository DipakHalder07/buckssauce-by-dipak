const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_final_check_' + Date.now());

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

    const errors = [];
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

      // Scroll across page
      const scrolls = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 0];
      let i = 0;
      const interval = setInterval(() => {
        if (i < scrolls.length) {
          ws.send(JSON.stringify({
            id: 10 + i,
            method: 'Runtime.evaluate',
            params: { expression: `window.scrollTo(0, ${scrolls[i]});` }
          }));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            console.log('Scroll test completed. Total errors:', errors.length);
            if (errors.length > 0) {
              console.log('Errors:', errors);
            }
            chrome.kill();
            process.exit(0);
          }, 1000);
        }
      }, 300);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(msg.params.exceptionDetails.text + ' ' + msg.params.exceptionDetails.exception?.description);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
