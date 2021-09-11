const getTaskInfo = async (task, page) => {
  try {
    return await page.evaluate(element => {
      const title = element.querySelector('.task-title > div').innerText;
      const description = element.querySelector('p.card-text').innerText;
  
      return {
        title,
        description
      };
    }, task);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getTaskInfo
};
