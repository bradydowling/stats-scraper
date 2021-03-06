import * as d3 from '../web_modules/d3.js';
import * as d3Array from '../web_modules/d3-array.js';
import { ALL_STATS as data } from './../data/scoringData.js';
import teamColorMap from '../data/teamColors.js';

const margin = { top: 16, right: 6, bottom: 6, left: 0 };
const barSize = 48;
const visibleBarsNum = 25;
const height = margin.top + barSize * visibleBarsNum + margin.bottom;
const width = 2200; // Height scales inversely proportional to this number, it could be renamed or else functionality with it can be changed for it to actually be width

const y = d3
  .scaleBand()
  .domain(d3.range(visibleBarsNum + 1))
  .rangeRound([margin.top, margin.top + barSize * (visibleBarsNum + 1 + 0.1)])
  .padding(0.1);
const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);

const duration = 250;

async function chart() {
  const barsNum = 10;

  const names = new Set(
    data.map((d, i) => {
      return d.name;
    })
  );

  const playerTeamMap = data.reduce((currentMap, player) => {
    if (!player.teamName) {
      return currentMap;
    }
    if (currentMap[player.name]) {
      currentMap[player.name].push(player.teamName);
      return currentMap;
    }
    currentMap[player.name] = [player.teamName];
    return currentMap;
  }, {});

  const color = ({ name: playerName }) => {
    const playersTeams = playerTeamMap[playerName];
    const teamWithColor = playersTeams.find(team => {
      return teamColorMap[team];
    });
    const teamColor = teamColorMap[teamWithColor];
    return teamColor || d3.interpolateSinebow(Math.random());
  };

  const datevalues = Array.from(
    d3Array.rollup(
      data,
      ([d]) => d.value,
      d => +d.date,
      d => d.name
    )
  )
    .map(([date, data]) => [new Date(date), data])
    .sort(([a], [b]) => d3.ascending(a, b));

  const rank = value => {
    const data = Array.from(names, name => ({ name, value: value(name) }));
    data.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i)
      data[i].rank = Math.min(visibleBarsNum, i);
    return data;
  };

  const keyframes = [];
  let kb1, b1; // These need to be from the last pair of d3.pairs(datevalues)
  // Once you get that, you can change this to use .map instead
  for (const pairs of d3.pairs(datevalues)) {
    const [[ka, a], [kb, b]] = pairs;
    kb1 = kb;
    b1 = b;
    for (let i = 0; i < barsNum; ++i) {
      const t = i / barsNum;
      keyframes.push([
        new Date(ka * (1 - t) + kb * t),
        rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t),
      ]);
    }
  }
  keyframes.push([new Date(kb1), rank(name => b1.get(name) || 0)]);

  const nameframes = d3Array.groups(
    keyframes.flatMap(([, data]) => data),
    d => d.name
  );
  const prev = new Map(
    nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
  );
  const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

  const bars = svg => {
    let bar = svg
      .append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('rect');

    return ([date, data], transition) =>
      (bar = bar
        .data(data.slice(0, visibleBarsNum), d => d.name)
        .join(
          enter =>
            enter
              .append('rect')
              .attr('fill', color)
              .attr('height', y.bandwidth())
              .attr('x', x(0))
              .attr('y', d => y((prev.get(d) || d).rank))
              .attr('width', d => x((prev.get(d) || d).value) - x(0)),
          update => update,
          exit =>
            exit
              .transition(transition)
              .remove()
              .attr('y', d => y((next.get(d) || d).rank))
              .attr('width', d => x((next.get(d) || d).value) - x(0))
        )
        .call(bar =>
          bar
            .transition(transition)
            .attr('y', d => y(d.rank))
            .attr('width', d => x(d.value) - x(0))
        ));
  };

  const axis = svg => {
    const g = svg.append('g').attr('transform', `translate(0,${margin.top})`);

    const axis = d3
      .axisTop(x)
      .ticks(width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (visibleBarsNum + y.padding()));

    return (_, transition) => {
      g.transition(transition).call(axis);
      g.select('.tick:first-of-type text').remove();
      g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white');
      g.select('.domain').remove();
    };
  };

  const formatNumber = d3.format(',d');

  function textTween(a, b) {
    const i = d3.interpolateNumber(a, b);
    return function(t) {
      this.textContent = formatNumber(i(t));
    };
  }

  const labels = svg => {
    let label = svg
      .append('g')
      .style('font-variant-numeric', 'tabular-nums')
      .attr('font-family', 'Sans Serif')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('color', 'white')
      .attr('text-anchor', 'end')
      .selectAll('text');

    return ([date, data], transition) =>
      (label = label
        .data(data.slice(0, visibleBarsNum), d => d.name)
        .join(
          enter =>
            enter
              .append('text')
              .attr(
                'transform',
                d =>
                  `translate(${x((prev.get(d) || d).value)},${y(
                    (prev.get(d) || d).rank
                  )})`
              )
              .attr('y', y.bandwidth() / 2)
              .attr('x', -6)
              .attr('dy', '-0.25em')
              .text(d => d.name)
              .call(text =>
                text
                  .append('tspan')
                  .attr('fill-opacity', 0.7)
                  .attr('font-weight', 'normal')
                  .attr('x', -6)
                  .attr('dy', '1.15em')
              ),
          update => update,
          exit =>
            exit
              .transition(transition)
              .remove()
              .attr(
                'transform',
                d =>
                  `translate(${x((next.get(d) || d).value)},${y(
                    (next.get(d) || d).rank
                  )})`
              )
              .call(g =>
                g
                  .select('tspan')
                  .tween('text', d =>
                    textTween(d.value, (next.get(d) || d).value)
                  )
              )
        )
        .call(bar =>
          bar
            .transition(transition)
            .attr('transform', d => `translate(${x(d.value)},${y(d.rank)})`)
            .call(g =>
              g
                .select('tspan')
                .tween('text', d =>
                  textTween((prev.get(d) || d).value, d.value)
                )
            )
        ));
  };

  const formatDate = d3.utcFormat('%Y');

  const ticker = svg => {
    const now = svg
      .append('text')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .attr('font-size', `${1.5 * barSize}`)
      .attr('class', 'yearLabel')
      .attr('text-anchor', 'end')
      .attr('x', width - 6)
      .attr('y', margin.top - barSize + barSize * (visibleBarsNum - 0.45))
      .attr('dy', '0.32em')
      .text(formatDate(keyframes[0][0]));

    return ([date], transition) => {
      transition.end().then(() => now.text(formatDate(date)));
    };
  };

  const svg = d3
    .select('div#container')
    .append('svg')
    .attr('viewBox', [0, 0, width, height]);

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);

  for (const keyframe of keyframes) {
    const transition = svg
      .transition()
      .duration(duration)
      .ease(d3.easeLinear);

    // Extract the top bar’s value.
    x.domain([0, keyframe[1][0].value]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    updateTicker(keyframe, transition);

    // This is key to making sure the animation happens smoothly without all happening at once
    await transition.end();
  }
}

chart();
