require('dotenv').config();

const puppeteer = require('puppeteer');
const { getTaskInfo } = require('../helpers/tasks');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
  
    await page.goto(process.env.LIST_GENERATOR_URL, {
      waitUntil: 'networkidle2'
    });

    await page.waitForXPath('//div[@class="tasks-card-container row"]');
    const taskContainers = await page.$x('//div[@class="taskCard card"]//div[@class="card-body"]');
    const tasks = await Promise.all(taskContainers.map(task => getTaskInfo(task, page)));
    
    await page.goto(process.env.TODOIST_URL, {
      waitUntil: 'networkidle2'
    });

    await page.waitForXPath('//header//a[contains(text(), "Iniciar sesión")]');
    const [visibleLoginLink] = await page.$x('//header//a[contains(text(), "Iniciar sesión")]');
    
    await visibleLoginLink.click();

    await Promise.all([
      page.waitForSelector('#email'),
      page.waitForSelector('#password')
    ]);

    await page.type('#email', process.env.EMAIL);
    await page.type('#password', process.env.PASSWORD);

    const [loginButton] = await page.$x('//button[contains(text(), "Inicia sesión")]');
    await loginButton.click();

    await page.waitForSelector('#quick_add_task_holder');
  } catch (e) {
    console.error(e);
  }
})();
