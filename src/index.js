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

    const taskContainers = await page.$x('//div[@class="taskCard card"]//div[@class="card-body"]');
    const tasks = await Promise.all(taskContainers.map(task => getTaskInfo(task, page)));
    
    console.log(tasks);

  } catch (e) {
    console.error(e);
  }
})();
