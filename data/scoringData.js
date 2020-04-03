import stats from './stats/index.js';

const getYearDate = yearString => new Date(yearString.split('-')[0]);
const getReadableName = nameString => {
  return nameString
    .toLowerCase()
    .split('_')
    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
};
const getTeamName = teamString => teamString;

const isPartialSeason = (i, statsArray, thisYear) => {
  if (i === 0) {
    return false;
  }
  const prevStatline = statsArray[i - 1];
  if (
    prevStatline.teamName === 'TOT' &&
    thisYear.date.getTime() === prevStatline.date.getTime()
  ) {
    return true;
  }
  if (i === 1) {
    return false;
  }
  const twoStatlinesAgo = statsArray[i - 2];
  if (
    twoStatlinesAgo.teamName === 'TOT' &&
    thisYear.date.getTime() === twoStatlinesAgo.date.getTime()
  ) {
    return true;
  }
  return false;
};

const statsByPlayer = Object.keys(stats).map((playerName, i) => {
  let playerPoints = 0;
  const yearlyStats = stats[playerName].map((yearStats, i, statsArray) => {
    const teamName = getTeamName(yearStats.team_id);
    if (teamName !== 'TOT' && !isPartialSeason(i, statsArray, yearStats)) {
      playerPoints += +yearStats.pts;
    }
    return {
      date: getYearDate(yearStats.season),
      name: getReadableName(playerName),
      teamName,
      value: playerPoints,
    };
  });
  const partialYears = yearlyStats
    .filter(yearStats => yearStats.teamName === 'TOT')
    .map(yearStats => yearStats.date);

  return yearlyStats
    .filter(year => {
      return !partialYears.includes(year.date) || year.teamName === 'TOT';
    })
    .map((yearStats, i) => {
      return Object.assign({ seasonNum: i }, yearStats);
    });
  // TODO: The above functions should remove partial years properly
  // (once everything is done, total points aren't right)
});

const dateAnchor = statsByPlayer[0][0].date;
const firstDate = statsByPlayer.reduce((firstDate, playerStats) => {
  return playerStats[0].date < firstDate ? playerStats[0].date : firstDate;
}, dateAnchor);
const firstYear = firstDate.getFullYear() + 1;
const lastDate = statsByPlayer.reduce((lastDate, playerStats) => {
  const thisYear = playerStats[playerStats.length - 1].date;
  return thisYear > lastDate ? thisYear : lastDate;
}, dateAnchor);
const lastYear = lastDate.getFullYear() + 1;

// Add empty years after people retire and before they start
// so players have entries for all years in the whole chart
const filledOutStats = statsByPlayer.map(playerStats => {
  const playerName = playerStats[0].name;
  const playerFilledStats = [];
  let seasonNum = 0;
  let totalPoints = 0;
  for (let i = firstYear; i <= lastYear; i++) {
    const playerStatYear = playerStats.find(year => {
      const isCareerYear = year.date.getFullYear() + 1 === i;
      return isCareerYear;
    });
    if (playerStatYear) {
      playerFilledStats.push(playerStatYear);
      seasonNum++;
      totalPoints = playerStatYear.value;
    } else {
      // TODO This still have something going on that's imperfect
      playerFilledStats.push({
        date: new Date(`${i}`),
        seasonNum,
        name: playerName,
        teamName: null,
        value: totalPoints,
      });
    }
  }
  return playerFilledStats;
});

const ALL_STATS = filledOutStats.flat();

export { ALL_STATS };
