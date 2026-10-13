const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_canvas_draw_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9261',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9261/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Add script to evaluate on new document
      ws.send(JSON.stringify({
        id: 3,
        method: 'Page.addScriptToEvaluateOnNewDocument',
        params: {
          source: `
            window.__canvasCalls = [];
            const origDrawImage = CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function(...args) {
              window.__canvasCalls.push({ fn: 'drawImage', arg0: args[0]?.src || args[0]?.tagName, args: args.slice(1) });
              return origDrawImage.apply(this, args);
            };
            const origClearRect = CanvasRenderingContext2D.prototype.clearRect;
            CanvasRenderingContext2D.prototype.clearRect = function(...args) {
              window.__canvasCalls.push({ fn: 'clearRect', args });
              return origClearRect.apply(this, args);
            };
          `
        }
      }));

      // Reload page so script takes effect
      ws.send(JSON.stringify({ id: 4, method: 'Page.reload' }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                return {
                  callCount: window.__canvasCalls?.length,
                  calls: window.__canvasCalls?.slice(0, 30)
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 6000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10) {
        console.log('Canvas calls:');
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
