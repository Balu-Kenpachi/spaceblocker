spaceBlocker.controller('layoutCtrl', ['$scope', 'dataService', function ($scope, dataService) {

	$scope.timeSliderValue = 1025409600000;

	$scope.$on('sliderChanged', function(message, data){
		$scope.timeSliderValue = data();
		$scope.totaldesks=0;
		getdesks();

		console.log($scope.totaldesks);
		//fillSVGElements($scope.totaldesks);
	})

	$scope.floorList = dataService.getFloors();


	function getdesks(){

		// Keep a copy of the collection for tests
		var dataCopy = JSON.parse(JSON.stringify(data));

		$scope.deskArray=[];

		data.map(function(obj){

			obj.values.map(function(value){

				if(value[0]===$scope.timeSliderValue){
					$scope.deskArray.push(value);
					$scope.totaldesks=$scope.totaldesks+value[1];
				}
				return value[0]===1025409600000;
			});
		});
		
		//$scope.$apply();

		deskArrayGlobal=$scope.deskArray;

	}


	function getSubDocument(embedding_element) {
		    if (embedding_element.contentDocument)
		    {
			    return embedding_element.contentDocument;
		    }
		    else
		    {
			    var subdoc = null;
			    try {
				    subdoc = embedding_element.getSVGDocument();
			    } catch(e) {}
			    return subdoc;
		    }
	    }


    // fetches the document for the given embedding_element
    function fillSVGElements(desks) {
	    var elms = document.querySelectorAll(".emb");
	    for (var i = 0; i < elms.length; i++)
	    {
		    var subdoc = getSubDocument(elms[i])
		    if (subdoc)
		    {
			    for(i=1;i<=60;i++){
				    subdoc.getElementById(i).setAttribute("fill", "lime");
			    }

		    	for(i=1;i<=desks;i++){
				    subdoc.getElementById(i).setAttribute("fill", "red");
			    }
		    }

	    }
    }


}]);