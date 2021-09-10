require('dotenv').config();

const puppeteer = require('puppeteer');

const getTaskInfo = async (task, page) => {
  // console.log(page, task);
  return await page.evaluate(element => {
    const title = element.querySelector('.task-title > div').innerText;
    const description = element.querySelector('p.card-text').innerText;

    return {
      title,
      description
    };
  }, task);
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
  
    await page.goto(process.env.LIST_GENERATOR_URL, {
      waitUntil: 'networkidle2'
    });

    const tasks = await page.$x('//div[@class="taskCard card"]//div[@class="card-body"]');



    Promise.all( tasks.map(getTaskInfo.bind(null, page)) )
      .then(values => console.log(values))
      .catch(err => console.error(err));

    console.log(tasks.length);
    await getTaskInfo(page, tasks[0])

  } catch (e) {
    console.error(e);
  }
})();
