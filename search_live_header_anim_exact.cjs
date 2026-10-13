const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_header_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--remote-debugging-port=9256',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9256/json');
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
                const matches = [];
                for (const url of scripts) {
                  try {
                    const text = await (await fetch(url)).text();
                    let pos = 0;
                    while ((pos = text.indexOf('isLaunchAnimationCompleted', pos)) !== -1) {
                      matches.push({
                        url,
                        snippet: text.slice(Math.max(0, pos - 200), pos + 800)
                      });
                      pos += 26;
                    }
                  } catch(e) {}
                }
                return matches;
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
        fs.writeFileSync('header_anim_matches.json', JSON.stringify(msg.result?.result?.value || [], null, 2));
        console.log('Saved header_anim_matches.json');
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
