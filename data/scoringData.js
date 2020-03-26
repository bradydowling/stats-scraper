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

// Need to filter out partial years
// Need to add empty years after people retire
const ALL_STATS = Object.keys(stats).reduce((allStats, playerName, i) => {
  let playerPoints = 0;
  const playerStats = stats[playerName].map((yearStats, seasonNum) => {
    playerPoints += +yearStats.pts;
    return {
      date: getYearDate(yearStats.season),
      seasonNum,
      name: getReadableName(playerName),
      teamName: getTeamName(yearStats.team_id),
      value: playerPoints,
    };
  });
  return allStats.concat(playerStats);
}, []);

export { ALL_STATS };
