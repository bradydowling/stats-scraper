const leadingScorers = require('./leadingScorers');
const fetch = require('node-fetch');
const $ = require('cheerio');

// TODO: Change to use https://www.landofbasketball.com/nba_players_stats/b/${firstName}_${lastName}_tot.htm

// Build array of objects with year and points for each entry
// Map array to objects with year and total points for each entry
// Convert array to CSV

async function getCareerStats({ firstName, lastName }) {
  const baseUrl = `https://www.basketball-reference.com/players/${lastName.toLowerCase().slice(0, 1)}/${lastName.toLowerCase().slice(0, 5)}${firstName.toLowerCase().slice(0, 2)}01.html`;

  fetch(baseUrl, {
    method: 'GET',
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.5",
      "Cache-Control": "max-age=0",
      "Connection": "keep-alive",
      "Cookie": "auth_checked=true; srcssfull=yes; is_live=true; SR_user=",
      "DNT": "1",
      "Host": "www.basketball-reference.com",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:74.0) Gecko/20100101 Firefox/74.0"
    }
  })
  .then(response => response.text())
  .then(parseYearlyStats)
  .catch(function(err){
    //handle error
  });
}

function parseYearlyStats(html) {
  const statHeaders = getStatHeaders(html);
  const yearlyStats = getYearlyStats(html, statHeaders);
  return yearlyStats;
}

function getStatHeaders(html) {
  const statHeaders = [];

  console.log($('thead', html).length);
  $('#totals thead tr th', html).each(function(i, elem) {
    console.log(i);
    console.log(elem);
    console.log($(this).text());
    statHeaders[i] = $(this).attr('data-stat');
  });
  console.log('statHeaders');
  console.log(statHeaders);
  return statHeaders;
}

function getYearlyStats() {
  const yearlyStats = [];
  $('#totals tbody tr', html).each(function(i) {
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

const testPlayer = [{ firstName: 'Dirk', lastName: 'Nowitzki'}];

getPlayersStats(testPlayer);
