const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_inspect_loader_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9248',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9248/json');
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
              (async function() {
                const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
                const results = [];
                for (const url of scripts) {
                  try {
                    const text = await (await fetch(url)).text();
                    if (text.includes('preloader') || text.includes('loader') || text.includes('pineapple-loader')) {
                      results.push({ url });
                      // Find snippets
                      let pos = 0;
                      while ((pos = text.indexOf('pineapple-loader', pos)) !== -1) {
                        results.push({
                          type: 'pineapple-loader',
                          snippet: text.slice(Math.max(0, pos - 500), pos + 1000)
                        });
                        pos += 20;
                      }
                    }
                  } catch(e) {}
                }
                return results;
              })()
            `,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      }, 4000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Loader Search Results:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
