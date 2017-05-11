spaceBlocker.controller('tableCtrl', ['$scope', 'dataService', 'timeService', function ($scope, dataService, timeService) {

	$scope.rowCollection = undefined;
	$scope.groups = undefined;

	$scope.activeDate = undefined;

	var init = function(){
		$scope.rowCollection = dataService.getRows();
		$scope.groups = [];		
		updateTable();
		highlight();
	}

	// function to generate random row - redundant?
	var generateItemFromSchedule = function (){
		var rand=Math.floor(Math.random() * 4);
		var Course=schedule[rand].course;
		var NumStudents = schedule[rand].students.reduce(function(a, b){return a+ b;}, 0);
		var ClassTime=schedule[rand].time;
		var LengthOfClass=schedule[rand].duration;
		var NumDesks = schedule[rand].desks;

		return {
			course:Course,
			students:NumStudents,
			time:ClassTime,
			duration:LengthOfClass,
			desks:NumDesks
		}
	}

	// function to convert data read from csv to js-object readable by data
	var generateObject = function(course){
		return {
			course:course[0],
			year:course[1],
			students:course[2],
			date:course[3],
			time:course[4],
			duration:course[5],
			desks:course[6]
		}
	}

	// function to convert to required data structure once the data is loaded from csv
	var updateTable = function(){
		
		$scope.rowCollection = dataService.getRows();
		$scope.groups = [];

		if($scope.rowCollection.length == 0)
			return;

		var years = [];

		for(var i=0; i<$scope.rowCollection.length; i++){

			var row = $scope.rowCollection[i];

			if(row.year == undefined){
				continue;
			}

			// if year doesn't exists, create the new group
			if(years[row.year] == undefined){
				
				years[row.year] = $scope.groups.length;

				var newgroup = {name: row.year};
				newgroup.students = row.students; 
				newgroup.modules = [];
				newgroup.modules.push({ name: row.course, rowIds: [i] });

				$scope.groups.push(newgroup);
			}
			else{

				// year exists - get the group
				var group = $scope.groups[years[row.year]];
				var mods = group.modules; 

				var flag = false;
				for(var j=0; j < group.modules.length; j++){
					if( row.course == group.modules[j].name ){
						group.modules[j].rowIds.push(i);
						flag = true;
						break;
					}
				}

				if(flag == false)
					group.modules.push({ name: row.course, rowIds: [i] });
			
			}
		}

		$scope.$apply();
	}

	var highlight = function(){
		$scope.activeDate = timeService.getTime()
	}

	$scope.importFromCSV = function() {

		$(document).on('click', '#btnImport', function(e){
			e.preventDefault();
			var file = $(this).parent().parent().parent().find('#fileImport');
			file.trigger('click');
		});

		var fileInputCSV = document.getElementById('fileImport');
		
		// when local file loaded
		fileInputCSV.addEventListener('change', function (e) {

			var new_rows = [];
			
			// parse as CSV
			var file = e.target.files[0];
			var csvParser = new SimpleExcel.Parser.CSV();
			csvParser.setDelimiter(',');

			csvParser.loadFile(file, function () {
				
				// draw HTML table based on sheet data
				var sheet = csvParser.getSheet();
				
				// Populate the rowCollection
				sheet.forEach(function (el, i) {
					
					var course=[];
					
					el.forEach(function (el, i) {
						course.push(el.value);
					});

					new_rows.push(generateObject(course));
				});

				dataService.setRows(new_rows);
				//updateTable();

			});
		});
	}

	//remove to the real data holder - is it needed?
	$scope.removeItem = function removeItem(row) {
		var index = $scope.rowCollection.indexOf(row);
		if (index !== -1) {
			$scope.rowCollection.splice(index, 1);
		}
	}

	//add to the real data holder
	$scope.addRandomItem = function() {
		$scope.rowCollection.push(generateItemFromSchedule());
	};

	$scope.init = init;
	$scope.highlight = highlight;
	dataService.registerObserverCallback(init);
	timeService.registerObserverCallback(highlight);

}]);


/*  Data structure for the groups
	{
	  name: '1',
	  students: '23',
	  isOpen: true,
	  modules: [ {name: 'AR123', rowIds: [2, 3, 4]}, 
	  				{name: 'AR23', rowIds: [2, 3, 4]}, 
	  					{name: 'AR43', rowIds: [2, 3, 4]}]
	},
	{
	  name: '2',
	  students: '34',
	  modules: [ {name: 'AR123', rowIds: [2, 3, 4]}, 
	  				{name: 'AR23', rowIds: [2, 3, 4]}, 
	  					{name: 'AR43', rowIds: [2, 3, 4]}]
	},
	{
	  name: '3',
	  students: '32',
		  modules: [ {name: 'AR123', rowIds: [2, 3, 4]}, 
			{name: 'AR23', rowIds: [2, 3, 4]}, 
				{name: 'AR43', rowIds: [2, 3, 4]}]
	},
	{
	  name: '4',
	  students: '123',
		  modules: [ {name: 'AR123', rowIds: [2, 3, 4]}, 
			{name: 'AR23', rowIds: [2, 3, 4]}, 
				{name: 'AR43', rowIds: [2, 3, 4]}]
	},
	{
	  name: '5',
	  students: '5',
		  modules: [ {name: 'AR123', rowIds: [2, 3, 4]}, 
			{name: 'AR23', rowIds: [2, 3, 4]}, 
				{name: 'AR43', rowIds: [2, 3, 4]}]
	}
*/