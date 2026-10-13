const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_nav_chunk_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--remote-debugging-port=9258',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9258/json');
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
                for (const url of scripts) {
                  try {
                    const text = await (await fetch(url)).text();
                    if (text.includes('translate-y-[200px]')) {
                      const idx = text.indexOf('translate-y-[200px]');
                      return { url, snippet: text.slice(Math.max(0, idx - 400), idx + 1000) };
                    }
                  } catch(e) {}
                }
                return null;
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
        fs.writeFileSync('header_chunk_match.json', JSON.stringify(msg.result?.result?.value || null, null, 2));
        console.log('Saved header_chunk_match.json');
        chrome.kill();
        process.exit(0);
      }
    };
  } catch(e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 3000);
