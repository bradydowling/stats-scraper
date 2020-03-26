import stats from './stats';

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
const allStats = Object.keys(stats).reduce((allStats, playerName, i) => {
  const playerStats = stats[playerName].map((yearStats, seasonNum) => {
    return {
      date: getYearDate(yearStats.season),
      seasonNum,
      name: getReadableName(playerName),
      teamName: getTeamName(yearStats.team_id),
      totalPoints: +yearStats.pts,
    };
  });
  return allStats.concat(playerStats);
}, []);

export default allStats;
