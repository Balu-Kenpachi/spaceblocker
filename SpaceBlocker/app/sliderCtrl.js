spaceBlocker.controller('sliderCtrl', ['$scope', '$filter', 'timeService', function ($scope, $filter, timeService) {

	//Slider config with custom display function
	$scope.slider_translate = {
		value: 0,
		options: {
			stepsArray: timeService.getTimeline(),
			onChange:  function(sliderId, modelValue, highValue, pointerType){
				timeService.setTime(modelValue);
			},
			translate: function (value) {
				return   $filter('date')(value, 'dd-MM-yyyy');;
			}
		}
	};

	var updateSlider = function(){
		$scope.slider_translate.options.stepsArray = timeService.getTimeline();
		$scope.$apply();
	}

	timeService.registerSliderObserverCallback(updateSlider);

}]);

