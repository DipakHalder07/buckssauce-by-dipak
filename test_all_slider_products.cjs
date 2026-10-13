const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_all_slider_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9266',
  'http://localhost:3000/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9266/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:3000'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let reqId = 1000;
    const sendCmd = (method, params = {}) => {
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

      // Wait 5s for preloader to reveal hero
      console.log('Waiting for preloader...');
      await new Promise(r => setTimeout(r, 5200));

      // Scroll slightly down so the entire hero stage and "SHOP NOW" button are beautifully framed
      await sendCmd('Runtime.evaluate', {
        expression: `
          window.scrollTo({ top: 120, behavior: 'instant' });
        `
      });
      await new Promise(r => setTimeout(r, 500));

      // 1. Capture Product 0 (Peach)
      let shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('slider_stage_0_peach.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved slider_stage_0_peach.png');

      // 2. Click next -> Product 1 (Pineapple)
      await sendCmd('Runtime.evaluate', {
        expression: `
          const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
          arrows[1].click();
        `
      });
      await new Promise(r => setTimeout(r, 1300));
      shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('slider_stage_1_pineapple.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved slider_stage_1_pineapple.png');

      // 3. Click next -> Product 2 (Habanero)
      await sendCmd('Runtime.evaluate', {
        expression: `
          const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
          arrows[1].click();
        `
      });
      await new Promise(r => setTimeout(r, 1300));
      shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('slider_stage_2_habanero.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved slider_stage_2_habanero.png');

      // 4. Click next -> Product 3 (Cherry)
      await sendCmd('Runtime.evaluate', {
        expression: `
          const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
          arrows[1].click();
        `
      });
      await new Promise(r => setTimeout(r, 1300));
      shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('slider_stage_3_cherry.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved slider_stage_3_cherry.png');

      // Check Lottie SVG presence in DOM
      const lottieDomCheck = await sendCmd('Runtime.evaluate', {
        expression: `
          (() => {
            const svgFaces = Array.from(document.querySelectorAll('.lottie-face-host svg')).map(s => ({
              parentClass: s.parentElement?.className,
              width: s.getAttribute('width') || s.getBoundingClientRect().width,
              height: s.getAttribute('height') || s.getBoundingClientRect().height
            }));
            return {
              svgCount: svgFaces.length,
              svgFaces
            };
          })()
        `,
        returnByValue: true
      });
      console.log('Lottie DOM check:', JSON.stringify(lottieDomCheck.result?.value, null, 2));

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
