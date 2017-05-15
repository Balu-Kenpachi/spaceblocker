spaceBlocker.controller('layoutCtrl', ['$scope', 'dataService', 'timeService', function ($scope, dataService, timeService) {


	$scope.activeDate = 1025409600000;
	$scope.rowCollection = undefined;
	$scope.deskArray=[];


	var timeChanged = function(){
		$scope.activeDate = timeService.getTime();
		desksNeeded();

	}

	var dataChanged = function(){

		$scope.rowCollection = dataService.getRows();
		timeChanged();

	}

	var desksNeeded = function(){

		$scope.rowCollection = dataService.getRows();
		$scope.deskArray=[];
		$scope.totaldesks=0;

		$scope.rowCollection.map(function(row){

			if(row.formattedDate==$scope.activeDate){
				$scope.deskArray.push(parseInt(row.desks));
				$scope.totaldesks=$scope.totaldesks+parseInt(row.desks);
			}
			console.log($scope.totaldesks);
			fillSVGElements($scope.totaldesks);
		});

	}



	$scope.floorList = dataService.getFloors();





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
			    for(i=1;i<=156;i++){
			       subdoc.getElementById(i).setAttribute("stroke", "red");
			       subdoc.getElementById(i).setAttribute("fill", "none");
			    }

		    	for(i=1;i<=desks;i++){
				    subdoc.getElementById(i).setAttribute("stroke", "lime");
				    subdoc.getElementById(i).setAttribute("fill", "none");

			    }
		    }


	    }
    }


	timeService.registerObserverCallback(timeChanged);
	dataService.registerObserverCallback(dataChanged);


}]);