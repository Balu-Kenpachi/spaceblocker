spaceBlocker.controller('graphCtrl', ['$rootScope','$scope',function($rootScope,$scope) {

	$scope.options = {
		chart: {
			type: 'stackedAreaChart',
			height: 450,
			margin : {
				top: 20,
				right: 20,
				bottom: 30,
				left: 40
			},
			x: function(d){return d[0];},
			y: function(d){return d[1];},
			useVoronoi: false,
			clipEdge: true,
			duration: 100,
			useInteractiveGuideline: true,
			xAxis: {
				showMaxMin: false,
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
	$scope.data = data;
	$scope.timeSliderValue = 0;
	$scope.$on('sliderChanged', function(message, data){
		$scope.timeSliderValue = data();

	})

}]);