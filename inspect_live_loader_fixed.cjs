const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_loader_inspect_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9241',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9241/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      
      // Evaluate immediately as page starts loading
      let checkCount = 0;
      const interval = setInterval(() => {
        checkCount++;
        if (checkCount > 15) {
          clearInterval(interval);
          chrome.kill();
          process.exit(0);
        }

        ws.send(JSON.stringify({
          id: 10 + checkCount,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                // Find all fixed elements
                const fixedEls = Array.from(document.querySelectorAll('*')).filter(el => {
                  const style = window.getComputedStyle(el);
                  return style.position === 'fixed' && parseInt(style.zIndex, 10) > 10;
                });
                return fixedEls.map(el => ({
                  tag: el.tagName,
                  id: el.id,
                  className: el.className,
                  zIndex: window.getComputedStyle(el).zIndex,
                  display: window.getComputedStyle(el).display,
                  opacity: window.getComputedStyle(el).opacity,
                  outerHTML: el.outerHTML.slice(0, 1000)
                }));
              })()
            `,
            returnByValue: true
          }
        }));
      }, 200);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id >= 10 && msg.result?.result?.value?.length > 0) {
        console.log(`[Check ${msg.id - 10}] Found fixed elements:`);
        msg.result.result.value.forEach(item => {
          console.log(`  ${item.tag}#${item.id}.${item.className} zIndex=${item.zIndex} opacity=${item.opacity}`);
          if (item.outerHTML.includes('BUCKS') || item.outerHTML.includes('img') || item.outerHTML.includes('svg')) {
            console.log('  outerHTML snippet:\n', item.outerHTML.slice(0, 400));
          }
        });
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
