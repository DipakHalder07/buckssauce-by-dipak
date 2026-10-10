const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_inspect_all_chunks_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9250',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9250/json');
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
                // Get all script tags
                const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
                // Also check inline scripts or manifest
                const results = [];
                for (const url of scripts) {
                  try {
                    const text = await (await fetch(url)).text();
                    ['pineapple-loader', 'habanero-loader', 'peach-loader', 'circle-gold', 'circleGold', 'loader'].forEach(term => {
                      if (text.includes(term)) {
                        const idx = text.indexOf(term);
                        results.push({
                          url,
                          term,
                          snippet: text.slice(Math.max(0, idx - 400), idx + 800)
                        });
                      }
                    });
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
        console.log('Search Results:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
