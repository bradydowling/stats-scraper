const rp = require('request-promise');
const cheerio = require('cheerio');

const baseUrl = `https://www.churchofjesuschrist.org/study/scriptures/nt/${book}/${chapter}?lang=eng`;
const options = {
  uri: baseUrl,
  transform: function (body) {
    return cheerio.load(body);
  }
};

// Get one scripture and count words
rp(options)
  .then(function($){
    let scriptureText = '';
    for (let i = versesStart; i <= versesEnd; i++) {
      scriptureText += $(`#p${i}.verse`).text().split(' ').slice(1).join(' ') + ' ';
    }
    const wordCount = scriptureText.split(' ').length;
    const characterCount = scriptureText.split('').length;
    console.log(`${scripture}: ${wordCount} words, ${characterCount} characters`);
  })
  .catch(function(err){
    //handle error
  });