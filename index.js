const leadingScorers = require('./leadingScorers');
const rp = require('request-promise');
const $ = require('cheerio');

// TODO: Change to use https://www.landofbasketball.com/nba_players_stats/b/${firstName}_${lastName}_tot.htm

// Build array of objects with year and points for each entry
// Map array to objects with year and total points for each entry
// Convert array to CSV

async function getCareerStats({ firstName, lastName }) {
  const baseUrl = `https://herosports.com/nba/player/${firstName.toLowerCase()}-${lastName.toLowerCase()}-stats`;

  rp(baseUrl)
  .then(function(html){
    const statHeaders = [];

    $('#table3 thead tr acronym', html).each(function(i, elem) {
      statHeaders[i] = $(this).attr('title').trim();
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
    return yearlyStats;
  })
  .catch(function(err){
    //handle error
  });
}

async function getPlayersStats(players) {
  for (let i = 0; i < players.length; i++) {
    const { firstName, lastName } = players[i];
    const careerStats = await getCareerStats({firstName, lastName });
    console.log({ fullName: `${firstName} ${lastName}`, ...careerStats });
  }
}

const allPlayers = leadingScorers.map(player => {
  const [firstName, lastName] = player.split(' ');
  return { firstName, lastName };
});

getPlayersStats(allPlayers);
