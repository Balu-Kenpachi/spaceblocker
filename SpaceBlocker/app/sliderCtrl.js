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
		// $scope.$apply();
	}

	var updateSliderValue =function(){
		$scope.slider_translate.value=timeService.getTime();

		// $scope.$apply();

	}

	$scope.timeline = timeService.getTimeline();



	var playAnimation=function(){

		for(i=$scope.timeline[0];i<=$scope.timeline[1];i=i+86400000){

		}

	}


	timeService.registerObserverCallback(updateSliderValue);

	timeService.registerSliderObserverCallback(updateSlider);

}]);

