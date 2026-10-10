const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_drawers_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9222',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let reqId = 200;
    const sendCmd = (method, params) => {
      return new Promise((resolve) => {
        const id = ++reqId;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    ws.onopen = async () => {
      await sendCmd('Runtime.enable');

      // Click Cart button
      await sendCmd('Runtime.evaluate', {
        expression: `
          const cartBtn = document.querySelector('[data-cart-button]');
          if (cartBtn) cartBtn.click();
        `
      });

      await new Promise(r => setTimeout(r, 600));
      let shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/cart_drawer_open.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/cart_drawer_open.png');

      // Close cart drawer
      await sendCmd('Runtime.evaluate', {
        expression: `
          const closeBtn = document.querySelector('[data-cart] [data-close]');
          if (closeBtn) closeBtn.click();
        `
      });

      await new Promise(r => setTimeout(r, 500));

      // Click Hamburger menu
      await sendCmd('Runtime.evaluate', {
        expression: `
          const menuBtn = document.querySelector('[data-hamburger]');
          if (menuBtn) menuBtn.click();
        `
      });

      await new Promise(r => setTimeout(r, 600));
      shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/menu_drawer_open.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/menu_drawer_open.png');

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
