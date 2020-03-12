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
