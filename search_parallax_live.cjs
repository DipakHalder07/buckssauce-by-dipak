const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_search_parallax_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--remote-debugging-port=9295',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9295/json');
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
                    ['parallax-food', 'parallax', 'data-parallax', 'mousemove', 'pointermove'].forEach(term => {
                      let pos = 0;
                      while ((pos = text.indexOf(term, pos)) !== -1) {
                        results.push({
                          url,
                          term,
                          snippet: text.slice(Math.max(0, pos - 300), pos + 700)
                        });
                        pos += term.length + 200;
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
        fs.writeFileSync('parallax_search.json', JSON.stringify(msg.result?.result?.value || [], null, 2));
        console.log('Saved parallax_search.json');
        chrome.kill();
        process.exit(0);
      }
    };
  } catch(e) { console.error(e); chrome.kill(); }
}, 3000);
