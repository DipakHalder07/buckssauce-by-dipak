const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_inspect_scripts_' + Date.now());

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
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                // Find all scripts
                const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src).filter(Boolean);

                // Check canvas context type
                const c = document.querySelector('[data-home-hero] canvas');
                let contextType = 'none';
                if (c) {
                  // see if 2d or webgl or webgl2
                  const gl = c.getContext('webgl2') || c.getContext('webgl');
                  if (gl) contextType = 'webgl';
                  else contextType = '2d';
                }

                // Check if Rive or Lottie or something is in webpack/next chunks
                let libraries = [];
                if (window.rive) libraries.push('rive');
                if (window.lottie) libraries.push('lottie');
                if (window.createRive) libraries.push('createRive');
                if (window.__NEXT_DATA__) libraries.push('nextjs');

                return { scripts, contextType, libraries, keys: Object.keys(window).filter(k => !k.startsWith('webkit') && !k.startsWith('on')).slice(0, 50) };
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
        console.log('Inspection:');
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
