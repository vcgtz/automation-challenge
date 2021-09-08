require('dotenv').config();

const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
  
    await page.goto(process.env.LIST_GENERATOR_URL, {
      waitUntil: 'networkidle2'
    });
  } catch (e) {
    console.error(e);
  }
})();
