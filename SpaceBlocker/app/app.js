/**
 * Created by sereb on 10/3/2017.
 */

var spaceBlocker= angular.module('spaceBlocker',['ui.layout','rzModule', 'ui.bootstrap','smart-table','nvd3']);

deskArrayGlobal=null;

spaceBlocker.controller("myCtrl", function($scope) {
	
	$scope.LoadFloor = function(selectedFloor) {
		$scope.floorImage = selectedFloor;
	};

});
