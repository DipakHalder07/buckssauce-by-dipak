const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_sec2_cards_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9234',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9234/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Wait 3s for preloader
      setTimeout(async () => {
        // Scroll right to the listing cards
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async function() {
                const card = document.querySelectorAll('[data-listing-card]')[0];
                card.scrollIntoView({ block: 'center', behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));
                card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                await new Promise(r => setTimeout(r, 500));
              })()
            `,
            awaitPromise: true
          }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 11, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 1200);

        setTimeout(() => {
          chrome.kill();
          process.exit(0);
        }, 2500);

      }, 3000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 11 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'section_2_cards_antlers_revealed.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved section_2_cards_antlers_revealed.png!');
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
