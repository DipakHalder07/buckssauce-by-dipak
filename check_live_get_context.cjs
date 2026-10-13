const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_canvas_ctx_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9262',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9262/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      ws.send(JSON.stringify({
        id: 3,
        method: 'Page.addScriptToEvaluateOnNewDocument',
        params: {
          source: `
            window.__ctxCalls = [];
            const origGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(type, ...args) {
              window.__ctxCalls.push({ type, args, stack: new Error().stack });
              return origGetContext.call(this, type, ...args);
            };
          `
        }
      }));

      ws.send(JSON.stringify({ id: 4, method: 'Page.reload' }));

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                return {
                  ctxCalls: window.__ctxCalls?.map(c => ({ type: c.type, stack: c.stack?.split('\\n').slice(1, 4).join(' | ') }))
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
        console.log('GetContext calls:');
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
