//
//usage node notifier.js <link_to_kleinanzeigen_item> <file_name_for_storing_items_information>
//
const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TG_TOKEN;
//const bot = new TelegramBot(token, {polling: true});

function getNotified(url, filename) {
  setInterval(() => {
    let TIME = new Date().toLocaleString();
    console.log('run for ' + filename + ' ' + TIME);
    console.log(url)
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
    }
    axios.get(url, { headers })
      .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          let devtoList = [];
          $('.aditem-main').each(function(i, elem) {
            devtoList[i] = {
              title: $(this).find('h2').text().trim(),
              url: $(this).find('a').attr('href')
            }
        })
        let lastUrl = 'https://www.kleinanzeigen.de' + devtoList[0].url;
        adTitle = devtoList[0].title;
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
              console.log(err);
            }
            const content = data;
            if (content != lastUrl) {
              console.log('new');
              let msg = (adTitle + ' ' + lastUrl);
              //bot.sendMessage('', msg);
              fs.writeFile(filename, lastUrl, (err) => {
                if (err) console.log(err);
              })
            } else {
              console.log('nothing new ' + TIME);
            }
        })
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
      });
  //}, Math.floor(Math.random() * 1500) + 3000)
  }, Math.floor(Math.random() * 150000) + 300000)
}

//argv[2] is the first command line argument
getNotified(process.argv[2], process.argv[3]);
