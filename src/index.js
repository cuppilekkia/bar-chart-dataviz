import './index.css';
import * as d3 from 'd3';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

let data;
let formatTime = d3.timeFormat("%e %b %Y");
let formatValue = d3.format("$,.2f");

const margin = {
        top: 40,
        right: 20,
        bottom: 40,
        left: 60
      },
      width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

let svg = d3.select(".chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    data = json;
    buildSVG();
  });

function buildSVG() {
  let minDate = new Date(data.data[0][0]);
  let maxDate = new Date(data.data[data.data.length - 1][0]);
  let x = d3.scaleTime().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);
  let barWidth = Math.ceil(width/data.data.length);

  x.domain([minDate, maxDate]);
  x.ticks(d3.timeYear.every(1));
  y.domain([0, d3.max(data.data, (d) => d[1])]);

  let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  let title = d3.select(".title").html(data.name);
  svg.selectAll(".bar")
    .data(data.data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(new Date(d[0])))
      .attr("width", barWidth)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => height - y(d[1]))
      .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(formatTime(new Date(d[0])) + "<br/>" + formatValue(d[1]))
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y));
}
