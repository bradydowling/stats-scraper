const teamColors = [
  {
    team: 'Atlanta Hawks',
    color: 'rgb(224, 58, 62)',
  },
  {
    team: 'Boston Celtics',
    color: 'rgb(0, 122, 51)',
  },
  {
    team: 'Brooklyn Nets',
    color: 'rgb(0, 0, 0)',
  },
  {
    team: 'Charlotte Hornets',
    color: 'rgb(29, 17, 96)',
  },
  {
    team: 'Chicago Bulls',
    color: 'rgb(206, 17, 65)',
  },
  {
    team: 'Cleveland Cavaliers',
    color: 'rgb(111, 38, 61)',
  },
  {
    team: 'Dallas Mavericks',
    color: 'rgb(0, 83, 140)',
  },
  {
    team: 'Denver Nuggets',
    color: 'rgb(0, 40, 94)',
  },
  {
    team: 'Detroit Pistons',
    color: 'rgb(237, 23, 76)',
  },
  {
    team: 'Golden State Warriors',
    color: 'rgb(0, 107, 182)',
  },
  {
    team: 'Houston Rockets',
    color: 'rgb(206, 17, 65)',
  },
  {
    team: 'Indiana Pacers',
    color: 'rgb(0, 45, 98)',
  },
  {
    team: 'Los Angeles Clippers',
    color: 'rgb(237, 23, 76)',
  },
  {
    team: 'Los Angeles Lakers',
    color: 'rgb(85, 37, 131)',
  },
  {
    team: 'Memphis Grizzlies',
    color: 'rgb(97, 137, 185)',
  },
  {
    team: 'Miami Heat',
    color: 'rgb(152, 0, 46)',
  },
  {
    team: 'Milwaukee Bucks',
    color: 'rgb(0, 71, 27)',
  },
  {
    team: 'Minnesota Timberwolves',
    color: 'rgb(12, 35, 64)',
  },
  {
    team: 'New Orleans Pelicans',
    color: 'rgb(0, 43, 92)',
  },
  {
    team: 'New York Knicks',
    color: 'rgb(0, 107, 182)',
  },
  {
    team: 'Oklahoma City Thunder',
    color: 'rgb(0, 122, 193)',
  },
  {
    team: 'Orlando Magic',
    color: 'rgb(0, 87, 184)',
  },
  {
    team: 'Philadelphia 76ers',
    color: 'rgb(0, 107, 182)',
  },
  {
    team: 'Phoenix Suns',
    color: 'rgb(29, 17, 96)',
  },
  {
    team: 'Portland Trail Blazers',
    color: 'rgb(224, 58, 62)',
  },
  {
    team: 'Sacramento Kings',
    color: 'rgb(90, 45, 129)',
  },
  {
    team: 'San Antonio Spurs',
    color: 'rgb(0, 0, 0)',
  },
  {
    team: 'Toronto Raptors',
    color: 'rgb(206, 17, 65)',
  },
  {
    team: 'Utah Jazz',
    color: 'rgb(0, 43, 92)',
  },
  {
    team: 'Washington Wizards',
    color: 'rgb(0, 43, 92)',
  },
  {
    team: 'Seattle Supersonics',
    color: 'rgb(0, 101, 58)',
  },
];

const teamColorMap = teamColors.reduce((colors, { team: name, color }) => {
  let teamAbbr;
  if (name === 'Brooklyn Nets') {
    teamAbbr = 'BKN';
  } else if (name === 'Golden State Warriors') {
    teamAbbr = 'GSW';
  } else if (name === 'Los Angeles Clippers') {
    teamAbbr = 'LAC';
  } else if (name === 'Los Angeles Lakers') {
    teamAbbr = 'LAL';
  } else if (name === 'New Orleans Pelicans') {
    teamAbbr = 'NOP';
  } else if (name === 'New York Knicks') {
    teamAbbr = 'NYK';
  } else if (name === 'Oklahoma City Thunder') {
    teamAbbr = 'OKC';
  } else if (name === 'San Antonio Spurs') {
    teamAbbr = 'SAS';
  } else {
    teamAbbr = name.toUpperCase().slice(0, 3);
  }
  colors[teamAbbr] = color;
  return colors;
}, {});

teamColorMap['STL'] = 'rgb(224, 58, 62)';

export default teamColorMap;
