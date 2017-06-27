spaceBlocker.controller('graphCtrl', ['dataService', 'timeService', '$scope',function(dataService, timeService, $scope) {

	$scope.width = $("#GraphPane").width();

	$scope.options = {
		chart: {
			type: 'stackedAreaChart',
			width: $scope.width,
			height: 450,
			margin : {
				top: 20,
				right: 20,
				bottom: 30,
				left: 40
			},
			x: function(d){ return d[0];},
			y: function(d){return d[1];},
			useVoronoi: false,
			clipEdge: true,
			duration: 100,
			useInteractiveGuideline: true,
			xAxis: {
				showMaxMin: true,
				tickFormat: function(d) {
					return d3.time.format('%x')(new Date(d))
				}
			},
			yAxis: {
				tickFormat: function(d){
					return d3.format(',.2f')(d);
				}
			},
			zoom: {
				enabled: true,
				scaleExtent: [1, 10],
				useFixedDomain: false,
				useNiceScale: false,
				horizontalOff: false,
				verticalOff: true,
				unzoomEventType: 'dblclick.zoom'
			},
			interactiveLayer: {

				dispatch: {
					elementMousemove: function(e) {

						// var today = new Date(e.pointXValue);
						// $scope.scrollValue=today.toDateString();
						// console.log(e.mouseX + " " + e.mouseY + " " +e.pointXValue);
					},
					elementClick: function(e) {
						// console.log(e.mouseX + " " + e.mouseY + " " + e.pointXValue);
					}
				},
			}
		}
	};

	$scope.data = dataService.getChartData();
	$scope.rowData=dataService.getRows();
	$scope.timeline = timeService.getTimeline();



	//// normal

	function drawGraph(){

		var colors = d3.scale.category20();

		var chart;
		nv.addGraph(function() {
			chart = nv.models.stackedAreaChart()
				.useInteractiveGuideline(true)
				.x(function(d) { return d[0] })
				.y(function(d) { return d[1] })
				.controlLabels({stacked: "Stacked"})
				.duration(300);

			chart.xAxis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
			chart.yAxis.tickFormat(d3.format(',.4f'));

			chart.legend.vers('furious');


			d3.select('#stackedAreaChart1')
				.datum($scope.data)
				.transition().duration(1000)
				.call(chart)
				.each('start', function() {
					setTimeout(function() {
						d3.selectAll('stackedAreaChart1').each(function() {
							if(this.__transition__)
								this.__transition__.duration = 1;
						})
					}, 0)
				});

			nv.utils.windowResize(chart.update);
			return chart;
		});



	}

	var updateGraph = function(){
		$scope.data = dataService.getChartData();
		$scope.rowData=dataService.getRows();

		// $scope.api.refresh();

		$scope.timeline = timeService.getTimeline();
		drawGraph();
		drawStackedAreaChart($scope.rowData,$scope.data);
		$scope.$apply();



	}

	var timeChanged = function(){
		$scope.activeDate = timeService.getTime();
		showTooltip($scope.activeDate );

	}





	function drawStackedAreaChart(rowData,data){

		"use strict";
		var margin = {top: 20, right: 60, bottom: 30, left: 40},
			width = 480 - margin.left - margin.right,
			height = 270 - margin.top - margin.bottom;



		var x_extent=d3.extent(rowData,function(d){
			return d['formattedDate'];
		});


		var x=d3.time.scale()
			.range([margin.left,width])
			.domain(x_extent);

		var x_axis=d3.svg.axis()
			.scale(x);


		var y=d3.scale.linear()
			.range([height,margin.top])
			.domain([0,200]);


		var y_axis=d3.svg.axis()
			.scale(y)
			.orient("left");

		// var color = d3.scale.ordinal()
		// 	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

		var color = d3.scale.category20();



		d3.select("div#graphDiv")
			.append("div")
			.classed("svg-container", true) //container class to make it responsive
			.append("svg")
			//responsive SVG needs these 2 attributes and no width and height attr
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 450 450")
			//class to make it responsive
			.classed("svg-content-responsive", true);


		var svg=d3.select(".svg-content-responsive");
		var div=d3.select("html").append("div").attr("class", "tooltip").style("opacity", 0);


		svg.append('g')
			.attr('class','x axis')
			.attr('transform','translate(0,'+ height +')')
			.call(x_axis);

		svg.append('g')
			.attr('class','y axis')
			.attr('transform','translate('+ margin.left +',0)')
			.call(y_axis);


		color.domain(data.map(function(arr){return arr['key'];}));

		var area = d3.svg.area()
			.x(function(d) { return x(d.date); })
			.y0(function(d) { return y(d.y0); })
			.y1(function(d) { return y(d.y0 + d.y); });

		var stack = d3.layout.stack()
			.values(function(d) { return d.values; });

		var browsers = stack(color.domain().map(function(year,i) {
			return {
				year: year,
				values: data[i]['values'].map(function(d) {
					return {date: d[0], y: d[1] * 1};
				})
			};
		}));


		var browser = svg.selectAll(".browser")
			.data(browsers)
			.enter()
			.append("g")
			.attr("class", "browser");

		browser.append("path")
			.attr("class", "area")
			.attr("d", function(d) { return area(d.values); })
			.style("fill", function(d) { return color(d.year); });


		browser.append("text")
			.datum(function(d) { return {name: d.year, value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
			.attr("x", -6)
			.attr("dy", ".35em")
			.text(function(d) { return d.year; });


		browser.on('mouseover',function(d){

			var path = d3.select(this);
			path.attr("class", "mouseover");



			div.transition()
				.duration(200)
				.style("opacity", 0.9);
				// div.html("<span class='firstLine'>Tool Tip Created </span><br><span class='secondLine'>Second Line</span>")
			div.html("")
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 15) + "px");


			// console.log(d3.event.pageX+"  "+d3.event.pageY);

			var tooltip=div.append("svg")
				            .attr("class", "tooltipSVG")
							.attr("width", 75)
							.attr("height", 75)
							.selectAll(".elements")
							.data(color.domain().slice().reverse())
							.enter()
							.append("g")
							.attr("class", "elements")
							.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })

			tooltip.append("rect")
				.attr("x", 0)
				.attr("width", 12)
				.attr("height", 12)
				.style("fill", color);


			tooltip.append("text")
						.attr("x", 20)
						.attr("y", 9)
						.attr("dy", ".25em")
						.style("text-anchor", "start")
						.text(function(d) { return d; });

		});


		browser.on("mouseout", function() {
			var path = d3.select(this);
			path.attr("class", "mouseoff");
			div.transition()
				.duration(500)
				.style("opacity", 0);
		});






		var legend = svg.selectAll(".legend")
			.data(color.domain().slice().reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("x", width+margin.right - 18)
			.attr("width", 12)
			.attr("height", 12)
			.style("fill", color);

		legend.append("text")
			.attr("x", width+margin.right - 24)
			.attr("y", 9)
			.attr("dy", ".25em")
			.style("text-anchor", "end")
			.text(function(d) { return d; });










	}


	function showTooltip(){

		var div=d3.select(".tooltip");

		div.transition()
			.duration(200)
			.style("opacity", 0.9);
		// div.html("<span class='firstLine'>Tool Tip Created </span><br><span class='secondLine'>Second Line</span>")
		div.html("")
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top", (d3.event.pageY - 15) + "px");


		console.log(d3.event.pageX+"  "+d3.event.pageY);

		var tooltip=div.append("svg")
			.attr("class", "tooltipSVG")
			.attr("width", 75)
			.attr("height", 75)
			.selectAll(".elements")
			.data(color.domain().slice().reverse())
			.enter()
			.append("g")
			.attr("class", "elements")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })

		tooltip.append("rect")
			.attr("x", 0)
			.attr("width", 12)
			.attr("height", 12)
			.style("fill", color);


		tooltip.append("text")
			.attr("x", 20)
			.attr("y", 9)
			.attr("dy", ".25em")
			.style("text-anchor", "start")
			.text(function(d) { return d; });

	}
	function hideTooltip(){

	}












	dataService.registerGraphObserverCallback(updateGraph);
	timeService.registerObserverCallback(timeChanged);





}]);


