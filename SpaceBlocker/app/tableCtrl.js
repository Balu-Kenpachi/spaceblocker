
	spaceBlocker.controller('tableCtrl', ['$scope', function ($scope) {

		$scope.schedule=schedule;

		function generateItemFromSchedule(){

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

		function generateObject(course){
			return {
				course:course[0],
				students:course[1],
				time:course[2],
				duration:course[3],
				desks:course[4]
			}


		}

		$scope.rowCollection = [];

		//add to the real data holder
		$scope.addRandomItem = function addRandomItem() {
			$scope.rowCollection.push(generateItemFromSchedule());


		};

		$scope.importFromCSV=function importFromCSV() {

			$(document).on('click', '#btnImport', function(e){
				e.preventDefault();
				var file = $(this).parent().parent().parent().find('#fileImport');
				file.trigger('click');
			});

			var fileInputCSV = document.getElementById('fileImport');
			// when local file loaded
			fileInputCSV.addEventListener('change', function (e) {
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
						$scope.rowCollection.push(generateObject(course));
						$scope.$apply();
					});
				});
			});
		}

		//remove to the real data holder
		$scope.removeItem = function removeItem(row) {
			var index = $scope.rowCollection.indexOf(row);
			if (index !== -1) {
				$scope.rowCollection.splice(index, 1);
			}
		}

	}]);