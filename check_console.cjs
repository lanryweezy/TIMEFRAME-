const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR STACK:', error.stack || error.message));

  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Page loaded, waiting 2s for errors...');
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.log('Goto error:', err.message);
  }

  await browser.close();
})();
