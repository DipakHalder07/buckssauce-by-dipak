const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_inspect_canvas_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9258',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9258/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    const networkUrls = [];

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Network.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
                  width: c.width,
                  height: c.height,
                  className: c.className,
                  parent: c.parentElement?.className,
                  dataset: Object.assign({}, c.dataset)
                }));

                const heroFoods = Array.from(document.querySelectorAll('[data-home-hero] [data-front-fruits] [data-fruit]')).map(f => {
                  return {
                    className: f.className,
                    html: f.innerHTML.slice(0, 200)
                  };
                });

                return { canvases, heroFoods, windowRive: typeof window.rive, riveProps: Object.keys(window).filter(k => k.toLowerCase().includes('rive')) };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 5000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Network.requestWillBeSent') {
        const u = msg.params.request.url;
        if (u.endsWith('.riv') || u.includes('rive') || u.includes('face') || u.includes('anim')) {
          networkUrls.push(u);
        }
      }
      if (msg.id === 10) {
        console.log('Result from live buckssauce.com:');
        console.log(JSON.stringify(msg.result?.result?.value, null, 2));
        console.log('Filtered network URLs:', networkUrls);
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
  }
}, 2000);
