const rp = require('request-promise');
const $ = require('cheerio');

const player = {
  firstName: 'Dirk',
  lastName: 'Nowitzki'
};

const baseUrl = `https://herosports.com/nba/player/${player.firstName.toLowerCase()}-${player.lastName.toLowerCase()}-stats`;

// Build array of objects with year and points for each entry
// Map array to objects with year and total points for each entry
// Convert array to CSV

rp(baseUrl)
  .then(function(html){
    const statHeaders = [];

    $('#table3 thead tr acronym', html).each(function(i, elem) {
      statHeaders[i] = $(this).text().trim();
    });

    const yearlyStats = [];
    $('#table3 tbody tr', html).each(function(i, elem) {
      const thisYear = {};
      const tableData = $(this).find('td');
      tableData.each(function(index, item) {
        const key = statHeaders[index];
        thisYear[key] = $(this).text();
      });
      thisYear.index = i;
      yearlyStats.push(thisYear);
    });
    console.log(yearlyStats);
  })
  .catch(function(err){
    //handle error
  });
