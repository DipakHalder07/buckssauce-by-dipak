const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_sections_snap_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9233',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9233/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Wait 3s for preloader
      setTimeout(async () => {
        // Screenshot Section 1
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async function() {
                const sec1 = document.querySelectorAll('section')[1];
                sec1.scrollIntoView({ behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));
              })()
            `,
            awaitPromise: true
          }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 11, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 1000);

        // Screenshot Section 2 with hover on first card
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 20,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (async function() {
                  const sec2 = document.querySelectorAll('section')[2];
                  sec2.scrollIntoView({ behavior: 'instant' });
                  await new Promise(r => setTimeout(r, 600));
                  const card = document.querySelector('[data-listing-card]');
                  card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                  await new Promise(r => setTimeout(r, 500));
                })()
              `,
              awaitPromise: true
            }
          }));
        }, 2000);

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 21, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 3200);

        // Finish after 4.5s
        setTimeout(() => {
          chrome.kill();
          process.exit(0);
        }, 4500);

      }, 3000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 11 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'section_1_stacked_cards.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved section_1_stacked_cards.png!');
      }
      if (msg.id === 21 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'section_2_antlers_hover.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved section_2_antlers_hover.png!');
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
