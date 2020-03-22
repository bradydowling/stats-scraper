import * as d3 from '../web_modules/d3.js';

//------------------------SVG PREPARATION------------------------//
const width = 960;
const height = 500;
const adj = 20;

// we are appending SVG first
const svg = d3.select('div#container').append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `-${adj} -${adj} ${width + adj} ${height + adj}`)
    .style('padding', 5)
    .style('margin', 5)
    .classed('svg-content', true);

//-----------------------DATA PREPARATION------------------------//
const dataset = d3.csv('data.csv');
dataset.then((data) => {
  data.map((d) => {
    d.val = +d.val;
    return d;
  });
});

//---------------------------BAR CHART---------------------------//
dataset.then((data) => {
  svg.selectAll('div')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', (d, i) => {
    for (i>0; i < data.length; i++) {
      return i * 21;
    }
  })
  .attr('y', (d) => {
      return height - (d.val*10);
  })
  .attr('width', 20)
  .attr('height', (d) => {
    return d.val*10;
  });
});
