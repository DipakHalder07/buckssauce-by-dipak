const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_verify_anim_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9229',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9229/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    if (!target) {
      console.error('Target not found!');
      chrome.kill();
      process.exit(1);
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    const consoleLogs = [];
    const jsErrors = [];

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));

      // Wait 3s for preloader to finish
      setTimeout(async () => {
        // Test 1: Check header at top (scrollY = 0)
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const header = document.querySelector('header');
                const banner = document.querySelector('[data-banner]');
                const logo = header?.querySelector('[data-logo]');
                return {
                  bannerPresent: !!banner,
                  headerTop: window.getComputedStyle(header).top,
                  headerBg: window.getComputedStyle(header).backgroundColor,
                  headerTransform: window.getComputedStyle(header).transform,
                  logoTransform: window.getComputedStyle(logo).transform,
                  scrollY: window.scrollY
                };
              })()
            `,
            returnByValue: true
          }
        }));

        // Test 2: Scroll down 200px and check header glassmorphism
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 20,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (async function() {
                  window.scrollTo({ top: 200, behavior: 'instant' });
                  await new Promise(r => setTimeout(r, 600));
                  const header = document.querySelector('header');
                  const logo = header?.querySelector('[data-logo]');
                  return {
                    scrollY: window.scrollY,
                    headerBg: window.getComputedStyle(header).backgroundColor,
                    headerBackdrop: window.getComputedStyle(header).backdropFilter,
                    headerBorder: window.getComputedStyle(header).borderBottomColor,
                    headerBoxShadow: window.getComputedStyle(header).boxShadow,
                    logoTransform: window.getComputedStyle(logo).transform
                  };
                })()
              `,
              awaitPromise: true,
              returnByValue: true
            }
          }));
        }, 1000);

        // Test 3: Take screenshot of header with glassmorphic styling at scroll 200
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 25,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);

        // Test 4: Scroll to section 2 and test card antlers hover
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 30,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (async function() {
                  const card = document.querySelector('[data-listing-card]');
                  card.scrollIntoView();
                  await new Promise(r => setTimeout(r, 600));

                  const beforeHover = {
                    leftAntler: card.querySelector('[data-left-antler]').style.transform,
                    rightAntler: card.querySelector('[data-right-antler]').style.transform
                  };

                  card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                  await new Promise(r => setTimeout(r, 500));

                  const duringHover = {
                    leftAntler: card.querySelector('[data-left-antler]').style.transform,
                    rightAntler: card.querySelector('[data-right-antler]').style.transform,
                    bottleImg: card.querySelector('img')?.style.transform
                  };

                  card.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                  await new Promise(r => setTimeout(r, 400));

                  const afterHover = {
                    leftAntler: card.querySelector('[data-left-antler]').style.transform,
                    rightAntler: card.querySelector('[data-right-antler]').style.transform
                  };

                  return { beforeHover, duringHover, afterHover };
                })()
              `,
              awaitPromise: true,
              returnByValue: true
            }
          }));
        }, 3000);

        // Test 5: Check smart hide on scroll down 500px, reveal on scroll up
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 40,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (async function() {
                  const header = document.querySelector('header');
                  
                  // Scroll down to 600
                  window.scrollTo({ top: 600, behavior: 'instant' });
                  await new Promise(r => setTimeout(r, 500));
                  const downState = {
                    scrollY: window.scrollY,
                    headerTransform: window.getComputedStyle(header).transform
                  };

                  // Scroll up to 450
                  window.scrollTo({ top: 450, behavior: 'instant' });
                  await new Promise(r => setTimeout(r, 500));
                  const upState = {
                    scrollY: window.scrollY,
                    headerTransform: window.getComputedStyle(header).transform
                  };

                  return { downState, upState };
                })()
              `,
              awaitPromise: true,
              returnByValue: true
            }
          }));
        }, 4500);

        // Finish after 6s
        setTimeout(() => {
          console.log('\n--- Console Logs Recorded ---', consoleLogs);
          console.log('\n--- JS Errors Recorded ---', jsErrors);
          chrome.kill();
          process.exit(0);
        }, 6500);

      }, 3000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description).join(' ');
        consoleLogs.push(text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        jsErrors.push(msg.params.exceptionDetails);
      }

      if (msg.id === 10) {
        console.log('\n[TEST 1] Header initial at scroll 0:\n', JSON.stringify(msg.result?.result?.value, null, 2));
      }
      if (msg.id === 20) {
        console.log('\n[TEST 2] Header after scroll 200px (Frosted glass & logo scale):\n', JSON.stringify(msg.result?.result?.value, null, 2));
      }
      if (msg.id === 25 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'test_header_glassmorphic.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved test_header_glassmorphic.png!');
      }
      if (msg.id === 30) {
        console.log('\n[TEST 3] Antler hover state:\n', JSON.stringify(msg.result?.result?.value, null, 2));
      }
      if (msg.id === 40) {
        console.log('\n[TEST 4] Smart directional nav:\n', JSON.stringify(msg.result?.result?.value, null, 2));
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
