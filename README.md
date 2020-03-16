# Stats Scraper

Should scrape stats from Wikipedia or another related stat source and store them as a CSV, likely to be used for dataviz projects with D3.js

# Players List

To get an array of the top 50 all-time NBA scorers:
1. Open up the Wikipedia page for [NBA all-time scorers](https://en.wikipedia.org/wiki/List_of_National_Basketball_Association_career_scoring_leaders)
1. Open your browser console
1. Run the following script:

```
[...document.querySelectorAll('.wikitable.sortable.jquery-tablesorter tbody tr')].map(item => item.querySelector('td:nth-of-type(2) a').innerText)
```

**Note:** This could eventually be turned into a Cheerio script.

# Player Career Stats

**Note:** Until this is turned into a Cheerio script, you'll need to do this for all 50 players on the leading scorers list.

1. Open up the stats page pertain to your player of choice at `https://www.basketball-reference.com/players/${lastName.toLowerCase().slice(0, 1)}/${lastName.toLowerCase().slice(0, 5)}${firstName.toLowerCase().slice(0, 2)}01.html`
1. Open your browser console

To get an array stat categories from the table header:
```
const statHeaders = [...document.querySelectorAll('#totals thead th')].map(item => item.dataset.stat);
```

To get an array of a player's stats by seasons:

```
const careerStats = [...document.querySelectorAll('#totals tbody tr')].map(row => {
  const statCells = [...row.querySelectorAll('td, th')];
  return statCells.reduce((seasonStats, statCell, i) => {
    const key = statHeaders[i];
    seasonStats[key] = statCell.innerText;
    return seasonStats;
  }, {});
});
```
