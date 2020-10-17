import React from 'react';

import axios from 'axios';

import * as d3 from "d3";
import Chart from 'chart.js';

export default class BudgetList extends React.Component {
  state = {
    myBudget: []
  }

  componentDidMount() {
    var dataChart = {
        datasets: [{
            data: [],
            backgroundColor:[],
        }],
    
        labels: []
    };
    
    axios.get(`http://localhost:3000/budget`)
      .then(res => {
        for(var i=0; i<res.data.myBudget.length; i++){
            dataChart.datasets[0].data[i] = res.data.myBudget[i].budget;
            dataChart.labels[i] = res.data.myBudget[i].title;
            dataChart.datasets[0].backgroundColor[i] = res.data.myBudget[i].color;
        }
        const ctx = document.getElementById("myChart");
        new Chart(ctx, {
         type: "pie",
         data: dataChart
       });

      //D3 js charts

      var svg = d3.select(".another-chart-container")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = 600,
    height = 500,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };
var color;
var array = [];
var range = [];
var backgroundColor = [];

d3.json("http://localhost:3000/budget", function(data) {
    console.log(data["myBudget"]);
    
    for(var i = 0; i<data["myBudget"].length; i++){
        array[i] = data["myBudget"][i].title;
        range[i] = data["myBudget"][i].budget;
        backgroundColor[i] = data["myBudget"][i].color;
        console.log(array[i]);
    }

  
    var color = d3.scale
    .ordinal()
	.domain(array)
    .range(backgroundColor);
function randomData (){
    var labels = color.domain();
    var rangeValues = range;
    console.log(labels);
    var i = 0;
    var j = 0;
	return labels.map(function(label){
		return { label: labels[i++], value: rangeValues[j++] }
	});
}

change(randomData());


function change(data) {

	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice		
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};			
		});
	
	polyline.exit()
		.remove();
};

});


      });

      

  }

  render() {
    return (
        <div className="chart-container">
        <h1>Chart Js Pie Chart</h1>
        <canvas id="myChart"></canvas>

        <h1>D3Js Chart</h1>
        <div className="another-chart-container"></div>
        </div>
    )
  }
}