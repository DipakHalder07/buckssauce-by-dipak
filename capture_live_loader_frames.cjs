const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const framesDir = path.join(__dirname, 'live_loader_frames');
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);

const tmpDir = path.join(process.env.TEMP, 'chrome_live_loader_record_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9240',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9240/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    if (!target) {
      console.log('Target not found!');
      chrome.kill();
      process.exit(1);
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let frameCount = 0;
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Inspect loader in DOM immediately
      ws.send(JSON.stringify({
        id: 99,
        method: 'Runtime.evaluate',
        params: {
          expression: `
            (function() {
              const allEls = Array.from(document.querySelectorAll('*'));
              const loaderCandidates = allEls.filter(el => {
                const id = el.id || '';
                const cls = el.className || '';
                const data = Object.keys(el.dataset || {}).join(' ');
                return id.toLowerCase().includes('load') || 
                       cls.toLowerCase().includes('load') || 
                       cls.toLowerCase().includes('preloader') ||
                       cls.toLowerCase().includes('reveal') ||
                       data.toLowerCase().includes('load') ||
                       window.getComputedStyle(el).position === 'fixed' && window.getComputedStyle(el).zIndex > 100;
              }).map(el => ({
                tag: el.tagName,
                id: el.id,
                className: el.className,
                style: el.getAttribute('style'),
                zIndex: window.getComputedStyle(el).zIndex,
                outerHTML: el.outerHTML.slice(0, 500)
              }));
              return loaderCandidates;
            })()
          `,
          returnByValue: true
        }
      }));

      // Capture frames every 150ms for 3 seconds
      const interval = setInterval(() => {
        if (frameCount >= 20) {
          clearInterval(interval);
          setTimeout(() => {
            chrome.kill();
            process.exit(0);
          }, 500);
          return;
        }
        const currentFrame = frameCount++;
        ws.send(JSON.stringify({
          id: 100 + currentFrame,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 150);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 99) {
        console.log('Loader candidates on live site:\n', JSON.stringify(msg.result?.result?.value, null, 2));
      }
      if (msg.id >= 100 && msg.id < 200 && msg.result?.data) {
        const frameIdx = msg.id - 100;
        const filePath = path.join(framesDir, `frame_${frameIdx.toString().padStart(2, '0')}.png`);
        fs.writeFileSync(filePath, Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved frame ${frameIdx}`);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
