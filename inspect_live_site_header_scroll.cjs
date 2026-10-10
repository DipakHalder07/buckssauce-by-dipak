const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_inspect_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9223',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9223/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    if (!target) {
      console.log('No buckssauce target found, pages:', pages);
      chrome.kill();
      process.exit(1);
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const header = document.querySelector('header');
                const banner = document.querySelector('[data-banner]');
                const nav = document.querySelector('[data-nav]');
                
                // Let's check initial styles
                const initial = {
                  headerClass: header?.className,
                  headerStyle: header?.getAttribute('style'),
                  bannerText: banner?.innerText?.trim(),
                  scrollY: window.scrollY
                };

                // Let's scroll down 300px
                window.scrollTo(0, 300);
                const afterScroll = {
                  headerClass: header?.className,
                  headerStyle: header?.getAttribute('style'),
                  scrollY: window.scrollY
                };

                return { initial, afterScroll };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 3000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Live site inspection result:', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
