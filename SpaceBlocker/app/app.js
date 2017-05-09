/**
 * Created by sereb on 10/3/2017.
 */

/*(function(){*/

	deskArrayGlobal=null;
	var spaceBlocker= angular.module('spaceBlocker',['ui.layout','rzModule', 'ui.bootstrap','smart-table','nvd3']);

	spaceBlocker.controller("myCtrl", function($scope) {
		$scope.LoadFloor = function(selectedFloor) {
			$scope.floorImage=selectedFloor;

		};
	});
	spaceBlocker.controller('sliderCtrl',['$rootScope', '$timeout', '$modal','$scope',function ($rootScope, $timeout, $modal, $scope) {

		//Slider config with custom display function
		$scope.slider_translate = {
			value: 0,
			options: {
				stepsArray:timeline,
				translate: function (value) {
					//var sliderValue=value;
					var today = new Date(value);
					return  today.toDateString();
				}

			}
		};

		var broadcast = function(){
			$rootScope.$broadcast('sliderChanged', function(){
				return $scope.slider_translate.value;

			})
		}

		$scope.$watch('slider_translate.value', broadcast)



	}]);

	spaceBlocker.controller('tableCtrl', ['$scope', function ($scope) {

		$scope.schedule=schedule;

		function generateItemFromSchedule(){

			var rand=Math.floor(Math.random() * 4);
			var Course=schedule[rand].course;
			var Year=schedule[rand].year;
			var NumStudents = schedule[rand].students.reduce(function(a, b){return a+ b;}, 0);
			var Date=schedule[rand].date;
			var ClassTime=schedule[rand].time;
			var LengthOfClass=schedule[rand].duration;
			var NumDesks = schedule[rand].desks;

			return {
				course:Course,
				year:Year,
				students:NumStudents,
				date:Date,
				time:ClassTime,
				duration:LengthOfClass,
				desks:NumDesks
			}


		}

		function generateObject(course){
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

    spaceBlocker.controller('layoutCtrl',['$scope',function ($scope) {

	$scope.timeSliderValue = 1025409600000;
	$scope.$on('sliderChanged', function(message, data){
		$scope.timeSliderValue = data();
		$scope.totaldesks=0;
		getdesks();
		fillSVGElements($scope.totaldesks);



	})
	$scope.floorList=floors;


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
		$scope.$apply();

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
					    subdoc.getElementById(i).setAttribute("fill", "blue");
				    }

			    	for(i=1;i<=desks;i++){
					    subdoc.getElementById(i).setAttribute("fill", "lime");
				    }
			    }

		    }
	    }












}]);

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

	var floors=[
		{
			floorImage:"assets/images/Desks5.svg"
		}

	];

	var schedule=[
		{
			course:"AR2225",
			year:2,
			students:[10,8,7,0,0,0,0],
			date:'1/6/2017',
			time:'9:00:00',
			duration:120,
			desks:25
		},
		{
			course:"AR5225",
			year:4,
			students:[0,0,0,9,6,0,0],
			date:'2/6/2017',
			time:'11:00:00',
			duration:60,
			desks:15},
		{
			course:"AR6120",
			year:6,
			students:[0,0,0,0,0,4,5],
			date:'3/6/2017',
			time:'14:00:00',
			duration:120,
			desks:9
		},
		{
			course:"AR2120",
			year:2,
			students:[10,10,10,0,0,0,0],
			date:'4/6/2017',
			time:'16:00:00',
			duration:90,
			desks:9

		}
	];

	 var data = [
		{
			"key" : "First Year" ,
			"values" : [ [ 1025409600000 , 10] , [ 1028088000000 , 9] , [ 1030766400000 , 11] , [ 1033358400000 , 12] , [ 1036040400000 , 15] , [ 1038632400000 , 16] , [ 1041310800000 , 9] , [ 1043989200000 , 9] , [ 1046408400000 , 9] , [ 1049086800000 , 11] , [ 1051675200000 , 14] , [ 1054353600000 , 14] , [ 1056945600000 , 13] , [ 1059624000000 , 13] , [ 1062302400000 , 14] , [ 1064894400000 , 14] , [ 1067576400000 , 17] , [ 1070168400000 , 16] , [ 1072846800000 , 16] , [ 1075525200000 , 14] , [ 1078030800000 , 18] , [ 1080709200000 , 11] , [ 1083297600000 , 10] , [ 1085976000000 , 14] , [ 1088568000000 , 18] , [ 1091246400000 , 16] , [ 1093924800000 , 14] , [ 1096516800000 , 14] , [ 1099195200000 , 14] , [ 1101790800000 , 15] , [ 1104469200000 , 13] , [ 1107147600000 , 11] , [ 1109566800000 , 11] , [ 1112245200000 , 11] , [ 1114833600000 , 19] , [ 1117512000000 , 11] , [ 1120104000000 , 11] , [ 1122782400000 , 12] , [ 1125460800000 , 11] , [ 1128052800000 , 13] , [ 1130734800000 , 12] , [ 1133326800000 , 13] , [ 1136005200000 , 16] , [ 1138683600000 , 14] , [ 1141102800000 ,12] , [ 1143781200000 , 16] , [ 1146369600000 , 16] , [ 1149048000000 , 16] , [ 1151640000000 , 13] , [ 1154318400000 , 13] , [ 1156996800000 , 12] , [ 1159588800000 , 17] , [ 1162270800000 , 19] , [ 1164862800000 , 18] , [ 1167541200000 , 12] , [ 1170219600000 , 12] , [ 1172638800000 , 12] , [ 1175313600000 , 14] , [ 1177905600000 , 16] , [ 1180584000000 , 16] , [ 1183176000000 , 18] , [ 1185854400000 , 18] , [ 1188532800000 , 19] , [ 1191124800000 , 14] , [ 1193803200000 , 16] , [ 1196398800000 , 15] , [ 1199077200000 , 17] , [ 1201755600000 , 17] , [ 1204261200000 , 16] , [ 1206936000000 , 19] , [ 1209528000000 , 18] , [ 1212206400000 , 14] , [ 1214798400000 , 15] , [ 1217476800000 , 15] , [ 1220155200000 , 15] , [ 1222747200000 , 13] , [ 1225425600000 , 11] , [ 1228021200000 , 12] , [ 1230699600000 , 15] , [ 1233378000000 , 14] , [ 1235797200000 , 15] , [ 1238472000000 , 13] , [ 1241064000000 , 14] , [ 1243742400000 , 14] , [ 1246334400000 , 16] , [ 1249012800000 , 15] , [ 1251691200000 , 16] , [ 1254283200000 , 18] , [ 1256961600000 , 16] , [ 1259557200000 , 19] , [ 1262235600000 , 12] , [ 1264914000000 , 13] , [ 1267333200000 , 15] , [ 1270008000000 , 16] , [ 1272600000000 , 15] , [ 1275278400000 , 14] , [ 1277870400000 , 15] , [ 1280548800000 , 19] , [ 1283227200000 , 17] , [ 1285819200000 , 19] , [ 1288497600000 , 18] , [ 1291093200000 , 18] , [ 1293771600000 , 12] , [ 1296450000000 , 15] , [ 1298869200000 , 18] , [ 1301544000000 , 12] , [ 1304136000000 , 15] , [ 1306814400000 , 13] , [ 1309406400000 , 13] , [ 1312084800000 , 13] , [ 1314763200000 , 11] , [ 1317355200000 , 11] , [ 1320033600000 , 16] , [ 1322629200000 , 17] , [ 1325307600000 , 10] , [ 1327986000000 , 19] , [ 1330491600000 , 20] , [ 1333166400000 , 19] , [ 1335758400000 , 19]]
		},

		{
			"key" : "Second Year" ,
			"values" : [ [ 1025409600000 , 7] , [ 1028088000000 , 7] , [ 1030766400000 , 7] , [ 1033358400000 , 5] , [ 1036040400000 , 6] , [ 1038632400000 , 5] , [ 1041310800000 , 8] , [ 1043989200000 , 8] , [ 1046408400000 , 8] , [ 1049086800000 , 5] , [ 1051675200000 , 6] , [ 1054353600000 , 6] , [ 1056945600000 , 7] , [ 1059624000000 , 6] , [ 1062302400000 , 6] , [ 1064894400000 , 2] , [ 1067576400000 , 2] , [ 1070168400000 , 2] , [ 1072846800000 , 1] , [ 1075525200000 , 1] , [ 1078030800000 , 1] , [ 1080709200000 , 1] , [ 1083297600000 , 2] , [ 1085976000000 , 2] , [ 1088568000000 , 3] , [ 1091246400000 , 3] , [ 1093924800000 , 3] , [ 1096516800000 , 3] , [ 1099195200000 , 3] , [ 1101790800000 , 3] , [ 1104469200000 , 5] , [ 1107147600000 , 5] , [ 1109566800000 , 5] , [ 1112245200000 , 4] , [ 1114833600000 , 4] , [ 1117512000000 , 4] , [ 1120104000000 , 4] , [ 1122782400000 , 4] , [ 1125460800000 , 4] , [ 1128052800000 , 3] , [ 1130734800000 , 3] , [ 1133326800000 , 3] , [ 1136005200000 , 7] , [ 1138683600000 , 7] , [ 1141102800000 , 7] , [ 1143781200000 , 8] , [ 1146369600000 , 8] , [ 1149048000000 , 8] , [ 1151640000000 , 5] , [ 1154318400000 , 6] , [ 1156996800000 , 6] , [ 1159588800000 , 4] , [ 1162270800000 , 4] , [ 1164862800000 , 4] , [ 1167541200000 , 6] , [ 1170219600000 , 7] , [ 1172638800000 , 7] , [ 1175313600000 , 10] , [ 1177905600000 , 10] , [ 1180584000000 , 10] , [ 1183176000000 , 8] , [ 1185854400000 , 8] , [ 1188532800000 , 8] , [ 1191124800000 , 8] , [ 1193803200000 , 8] , [ 1196398800000 , 8] , [ 1199077200000 , 6] , [ 1201755600000 , 6] , [ 1204261200000 , 7] , [ 1206936000000 , 4] , [ 1209528000000 , 3] , [ 1212206400000 , 3] , [ 1214798400000 , 6] , [ 1217476800000 , 6] , [ 1220155200000 , 6] , [ 1222747200000 , 5] , [ 1225425600000 , 5] , [ 1228021200000 , 5] , [ 1230699600000 , 4] , [ 1233378000000 , 4] , [ 1235797200000 , 4] , [ 1238472000000 , 7] , [ 1241064000000 , 7] , [ 1243742400000 , 6] , [ 1246334400000 , 6] , [ 1249012800000 , 6] , [ 1251691200000 , 6] , [ 1254283200000 , 4] , [ 1256961600000 , 4] , [ 1259557200000 , 4] , [ 1262235600000 , 6] , [ 1264914000000 , 6] , [ 1267333200000 , 6] , [ 1270008000000 , 6] , [ 1272600000000 , 5] , [ 1275278400000 , 5] , [ 1277870400000 , 0] , [ 1280548800000 , 1] , [ 1283227200000 , 0] , [ 1285819200000 , 1] , [ 1288497600000 , 1] , [ 1291093200000 , 1] , [ 1293771600000 , 1] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 4] , [ 1320033600000 , 3] , [ 1322629200000 , 3] , [ 1325307600000 , 5] , [ 1327986000000 , 5] , [ 1330491600000 , 5] , [ 1333166400000 , 5] , [ 1335758400000 , 5]]
		},

		{
			"key" : "Third year" ,
			"values" : [ [ 1025409600000 , 7] , [ 1028088000000 , 7] , [ 1030766400000 , 7] , [ 1033358400000 , 8] , [ 1036040400000 , 9] , [ 1038632400000 , 9] , [ 1041310800000 , 10] , [ 1043989200000 , 10] , [ 1046408400000 , 10] , [ 1049086800000 , 8] , [ 1051675200000 , 9] , [ 1054353600000 , 8] , [ 1056945600000 , 8] , [ 1059624000000 , 8] , [ 1062302400000 , 7] , [ 1064894400000 , 7] , [ 1067576400000 , 8] , [ 1070168400000 , 8] , [ 1072846800000 , 9] , [ 1075525200000 , 9] , [ 1078030800000 , 10] , [ 1080709200000 , 9] , [ 1083297600000 , 8] , [ 1085976000000 , 9] , [ 1088568000000 , 9] , [ 1091246400000 , 9] , [ 1093924800000 , 10] , [ 1096516800000 , 10] , [ 1099195200000 , 10] , [ 1101790800000 , 10] , [ 1104469200000 , 10] , [ 1107147600000 , 10] , [ 1109566800000 , 9] , [ 1112245200000 , 9] , [ 1114833600000 , 9] , [ 1117512000000 , 9] , [ 1120104000000 , 12] , [ 1122782400000 , 12] , [ 1125460800000 , 12] , [ 1128052800000 , 8] , [ 1130734800000 , 8] , [ 1133326800000 , 9] , [ 1136005200000 , 12] , [ 1138683600000 , 13] , [ 1141102800000 , 13] , [ 1143781200000 , 6] , [ 1146369600000 , 6] , [ 1149048000000 , 6] , [ 1151640000000 , 5] , [ 1154318400000 , 5] , [ 1156996800000 , 5] , [ 1159588800000 , 6] , [ 1162270800000 , 7] , [ 1164862800000 , 6] , [ 1167541200000 , 9] , [ 1170219600000 , 9] , [ 1172638800000 , 8] , [ 1175313600000 , 10] , [ 1177905600000 , 10] , [ 1180584000000 , 10] , [ 1183176000000 , 10] , [ 1185854400000 , 9] , [ 1188532800000 , 9] , [ 1191124800000 , 10] , [ 1193803200000 , 9] , [ 1196398800000 , 9] , [ 1199077200000 , 8] , [ 1201755600000 , 8] , [ 1204261200000 , 8] , [ 1206936000000 , 8] , [ 1209528000000 , 8] , [ 1212206400000 , 7] , [ 1214798400000 , 7] , [ 1217476800000 , 6] , [ 1220155200000 , 6] , [ 1222747200000 , 6] , [ 1225425600000 , 6] , [ 1228021200000 , 5] , [ 1230699600000 , 5] , [ 1233378000000 , 4] , [ 1235797200000 , 4] , [ 1238472000000 , 5] , [ 1241064000000 , 5] , [ 1243742400000 , 5] , [ 1246334400000 , 7] , [ 1249012800000 , 7] , [ 1251691200000 , 7] , [ 1254283200000 , 10] , [ 1256961600000 , 9] , [ 1259557200000 , 9] , [ 1262235600000 , 10] , [ 1264914000000 , 11] , [ 1267333200000 , 11] , [ 1270008000000 , 8] , [ 1272600000000 , 8] , [ 1275278400000 , 7] , [ 1277870400000 , 8] , [ 1280548800000 , 9] , [ 1283227200000 , 8] , [ 1285819200000 , 10] , [ 1288497600000 , 10] , [ 1291093200000 , 9] , [ 1293771600000 , 10] , [ 1296450000000 , 16] , [ 1298869200000 , 17] , [ 1301544000000 , 16] , [ 1304136000000 , 17] , [ 1306814400000 , 16] , [ 1309406400000 , 15] , [ 1312084800000 , 14] , [ 1314763200000 , 24] , [ 1317355200000 , 18] , [ 1320033600000 , 15] , [ 1322629200000 , 14] , [ 1325307600000 , 16] , [ 1327986000000 , 16] , [ 1330491600000 , 17] , [ 1333166400000 , 18] , [ 1335758400000 , 18]]
		},

		{
			"key" : "Fourth Year" ,
			"values" : [ [ 1025409600000 , 3] , [ 1028088000000 , 2] , [ 1030766400000 , 2] , [ 1033358400000 , 3] , [ 1036040400000 , 4] , [ 1038632400000 , 4] , [ 1041310800000 , 2] , [ 1043989200000 , 2] , [ 1046408400000 , 2] , [ 1049086800000 , 3] , [ 1051675200000 , 2] , [ 1054353600000 , 2] , [ 1056945600000 , 2] , [ 1059624000000 , 2] , [ 1062302400000 , 1] , [ 1064894400000 , 1] , [ 1067576400000 , 0] , [ 1070168400000 , 1] , [ 1072846800000 , 1] , [ 1075525200000 , 1] , [ 1078030800000 , 2] , [ 1080709200000 , 1] , [ 1083297600000 , 1] , [ 1085976000000 , 1] , [ 1088568000000 , 1] , [ 1091246400000 , 1] , [ 1093924800000 , 1] , [ 1096516800000 , 1] , [ 1099195200000 , 1] , [ 1101790800000 , 1] , [ 1104469200000 ,3] , [ 1107147600000 , 3] , [ 1109566800000 , 3] , [ 1112245200000 , 3] , [ 1114833600000 , 3] , [ 1117512000000 , 3] , [ 1120104000000 , 2] , [ 1122782400000 , 2] , [ 1125460800000 , 2] , [ 1128052800000 , 9] , [ 1130734800000 , 9] , [ 1133326800000 , 9] , [ 1136005200000 , 4] , [ 1138683600000 , 4] , [ 1141102800000 , 3] , [ 1143781200000 , 5] , [ 1146369600000 , 4] , [ 1149048000000 , 3] , [ 1151640000000 , 5] , [ 1154318400000 , 6] , [ 1156996800000 , 6] , [ 1159588800000 , 4] , [ 1162270800000 , 4] , [ 1164862800000 , 3] , [ 1167541200000 , 2] , [ 1170219600000 , 3] , [ 1172638800000 , 3] , [ 1175313600000 , 5] , [ 1177905600000 , 6] , [ 1180584000000 , 6] , [ 1183176000000 , 7] , [ 1185854400000 , 7] , [ 1188532800000 , 8] , [ 1191124800000 , 5] , [ 1193803200000 , 5] , [ 1196398800000 , 5] , [ 1199077200000 , 9] , [ 1201755600000 , 9] , [ 1204261200000 , 8] , [ 1206936000000 , 8] , [ 1209528000000 , 7] , [ 1212206400000 , 6] , [ 1214798400000 , 8] , [ 1217476800000 , 8] , [ 1220155200000 , 8] , [ 1222747200000 , 6] , [ 1225425600000 , 4] , [ 1228021200000 , 4] , [ 1230699600000 , 3] , [ 1233378000000 , 4] , [ 1235797200000 , 3] , [ 1238472000000 , 1] , [ 1241064000000 , 9] , [ 1243742400000 , 1] , [ 1246334400000 , 1] , [ 1249012800000 , 1] , [ 1251691200000 , 1] , [ 1254283200000 , 0] , [ 1256961600000 , 9] , [ 1259557200000 , 1] , [ 1262235600000 , 3] , [ 1264914000000 , 4] , [ 1267333200000 , 4] , [ 1270008000000 , 3] , [ 1272600000000 , 2] , [ 1275278400000 , 1] , [ 1277870400000 , 3] , [ 1280548800000 , 3] , [ 1283227200000 , 3] , [ 1285819200000 , 3] , [ 1288497600000 , 4] , [ 1291093200000 , 3] , [ 1293771600000 , 3] , [ 1296450000000 , 9] , [ 1298869200000 , 5] , [ 1301544000000 , 2] , [ 1304136000000 , 5] , [ 1306814400000 , 4] , [ 1309406400000 , 4] , [ 1312084800000 , 2] , [ 1314763200000 , 6] , [ 1317355200000 , 5] , [ 1320033600000 , 2] , [ 1322629200000 , 2] , [ 1325307600000 , 5] , [ 1327986000000 , 5] , [ 1330491600000 , 5] , [ 1333166400000 , 5] , [ 1335758400000 , 5]]
		} ,

		{
			"key" : "Fifth Year" ,
			"values" : [ [ 1025409600000 , 9] , [ 1028088000000 , 8] , [ 1030766400000 , 8] , [ 1033358400000 , 8] , [ 1036040400000 , 10] , [ 1038632400000 , 12] , [ 1041310800000 , 10] , [ 1043989200000 , 11] , [ 1046408400000 , 11] , [ 1049086800000 , 10] , [ 1051675200000 , 11] , [ 1054353600000 , 12] , [ 1056945600000 , 8] , [ 1059624000000 , 8] , [ 1062302400000 , 8] , [ 1064894400000 , 7] , [ 1067576400000 , 9] , [ 1070168400000 , 9] , [ 1072846800000 , 10] , [ 1075525200000 , 10] , [ 1078030800000 , 10] , [ 1080709200000 , 13] , [ 1083297600000 , 12] , [ 1085976000000 , 13] , [ 1088568000000 , 12] , [ 1091246400000 , 11] , [ 1093924800000 , 12] , [ 1096516800000 , 11] , [ 1099195200000 , 12] , [ 1101790800000 , 12] , [ 1104469200000 , 9] , [ 1107147600000 , 8] , [ 1109566800000 , 8] , [ 1112245200000 , 11] , [ 1114833600000 , 11] , [ 1117512000000 , 12] , [ 1120104000000 , 10] , [ 1122782400000 , 10] , [ 1125460800000 , 10] , [ 1128052800000 , 17] , [ 1130734800000 , 15] , [ 1133326800000 , 16] , [ 1136005200000 , 12] , [ 1138683600000 , 13] , [ 1141102800000 , 12] , [ 1143781200000 , 2] , [ 1146369600000 , 2] , [ 1149048000000 , 2] , [ 1151640000000 , 6] , [ 1154318400000 , 4] , [ 1156996800000 , 5] , [ 1159588800000 , 2] , [ 1162270800000 , 6] , [ 1164862800000 , 6] , [ 1167541200000 , 8] , [ 1170219600000 , 8] , [ 1172638800000 , 9] , [ 1175313600000 , 8] , [ 1177905600000 , 7] , [ 1180584000000 , 7] , [ 1183176000000 , 8] , [ 1185854400000 , 9] , [ 1188532800000 , 8] , [ 1191124800000 , 3] , [ 1193803200000 , 4] , [ 1196398800000 , 2] , [ 1199077200000 , 3] , [ 1201755600000 , 8] , [ 1204261200000 , 7] , [ 1206936000000 , 7] , [ 1209528000000 , 8] , [ 1212206400000 , 9] , [ 1214798400000 , 9] , [ 1217476800000 , 8] , [ 1220155200000 , 8] , [ 1222747200000 , 5] , [ 1225425600000 , 12] , [ 1228021200000 , 2] , [ 1230699600000 , 5] , [ 1233378000000 , 7] , [ 1235797200000 , 1] , [ 1238472000000 , 2] , [ 1241064000000 , 4] , [ 1243742400000 , 5] , [ 1246334400000 , 6] , [ 1249012800000 , 7] , [ 1251691200000 , 7] , [ 1254283200000 , 5] , [ 1256961600000 , 3] , [ 1259557200000 , 5] , [ 1262235600000 , 4] , [ 1264914000000 , 3] , [ 1267333200000 , 2] , [ 1270008000000 , 3] , [ 1272600000000 , 3] , [ 1275278400000 , 3] , [ 1277870400000 , 3] , [ 1280548800000 , 3] , [ 1283227200000 , 3] , [ 1285819200000 , 3] , [ 1288497600000 , 3] , [ 1291093200000 , 3] , [ 1293771600000 , 3] , [ 1296450000000 , 14] , [ 1298869200000 , 14] , [ 1301544000000 , 3] , [ 1304136000000 , 4] , [ 1306814400000 , 3] , [ 1309406400000 , 3] , [ 1312084800000 , 3] , [ 1314763200000 , 4] , [ 1317355200000 , 4] , [ 1320033600000 , 3] , [ 1322629200000 , 3] , [ 1325307600000 , 3] , [ 1327986000000 , 3] , [ 1330491600000 , 3] , [ 1333166400000 , 3] , [ 1335758400000 , 3]]
		} ,

		{
			"key" : "MDesign" ,
			"values" : [ [ 1025409600000 , 0] , [ 1028088000000 , 4] , [ 1030766400000 , 4] , [ 1033358400000 , 0] , [ 1036040400000 , 6] , [ 1038632400000 , 6] , [ 1041310800000 , 5] , [ 1043989200000 , 5] , [ 1046408400000 , 5] , [ 1049086800000 , 5] , [ 1051675200000 , 5] , [ 1054353600000 , 5] , [ 1056945600000 , 6] , [ 1059624000000 , 6] , [ 1062302400000 , 7] , [ 1064894400000 , 4] , [ 1067576400000 , 4] , [ 1070168400000 , 4] , [ 1072846800000 , 4] , [ 1075525200000 , 4] , [ 1078030800000 , 4] , [ 1080709200000 , 3] , [ 1083297600000 , 3] , [ 1085976000000 , 3] , [ 1088568000000 , 4] , [ 1091246400000 , 4] , [ 1093924800000 , 5] , [ 1096516800000 , 5] , [ 1099195200000 , 5] , [ 1101790800000 , 5] , [ 1104469200000 , 5] , [ 1107147600000 , 5] , [ 1109566800000 , 6] , [ 1112245200000 , 6] , [ 1114833600000 , 5] , [ 1117512000000 , 6] , [ 1120104000000 , 5] , [ 1122782400000 , 5] , [ 1125460800000 , 5] , [ 1128052800000 , 5] , [ 1130734800000 , 5] , [ 1133326800000 , 5] , [ 1136005200000 , 5] , [ 1138683600000 , 5] , [ 1141102800000 , 5] , [ 1143781200000 , 7] , [ 1146369600000 , 7] , [ 1149048000000 , 8] , [ 1151640000000 , 7] , [ 1154318400000 , 8] , [ 1156996800000 , 8] , [ 1159588800000 , 4] , [ 1162270800000 , 4] , [ 1164862800000 , 4] , [ 1167541200000 , 5] , [ 1170219600000 , 6] , [ 1172638800000 , 6] , [ 1175313600000 , 5] , [ 1177905600000 , 5] , [ 1180584000000 , 5] , [ 1183176000000 , 5] , [ 1185854400000 , 5] , [ 1188532800000 , 5] , [ 1191124800000 , 4] , [ 1193803200000 , 4] , [ 1196398800000 , 4] , [ 1199077200000 , 4] , [ 1201755600000 , 4] , [ 1204261200000 , 4] , [ 1206936000000 , 4] , [ 1209528000000 , 4] , [ 1212206400000 , 4] , [ 1214798400000 , 3] , [ 1217476800000 , 3] , [ 1220155200000 , 2] , [ 1222747200000 , 2] , [ 1225425600000 , 2] , [ 1228021200000 , 1] , [ 1230699600000 , 0] , [ 1233378000000 , 0] , [ 1235797200000 , 0] , [ 1238472000000 , 0] , [ 1241064000000 , 0] , [ 1243742400000 , 0] , [ 1246334400000 , 0] , [ 1249012800000 , 0] , [ 1251691200000 , 0] , [ 1254283200000 , 0] , [ 1256961600000 , 0] , [ 1259557200000 , 0] , [ 1262235600000 , 0] , [ 1264914000000 , 0] , [ 1267333200000 , 0] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0] , [ 1288497600000 , 0] , [ 1291093200000 , 0] , [ 1293771600000 , 0] , [ 1296450000000 , 1] , [ 1298869200000 , 1] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 0] , [ 1320033600000 , 0] , [ 1322629200000 , 0] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0]]
		} ,

		{
			"key" : "PhD" ,
			"values" : [ [ 1025409600000 , 0] , [ 1028088000000 , 1] , [ 1030766400000 , 1] , [ 1033358400000 , 1] , [ 1036040400000 , 1] , [ 1038632400000 , 1] , [ 1041310800000 , 0] , [ 1043989200000 , 0] , [ 1046408400000 , 0] , [ 1049086800000 , 2] , [ 1051675200000 , 2] , [ 1054353600000 , 2] , [ 1056945600000 , 2] , [ 1059624000000 , 2] , [ 1062302400000 , 2] , [ 1064894400000 , 2] , [ 1067576400000 , 2] , [ 1070168400000 , 2] , [ 1072846800000 , 1] , [ 1075525200000 , 1] , [ 1078030800000 , 2] , [ 1080709200000 , 1] , [ 1083297600000 , 1] , [ 1085976000000 , 1] , [ 1088568000000 , 1] , [ 1091246400000 , 1] , [ 1093924800000 , 1] , [ 1096516800000 , 1] , [ 1099195200000 , 1] , [ 1101790800000 , 1] , [ 1104469200000 , 3] , [ 1107147600000 , 3] , [ 1109566800000 , 3] , [ 1112245200000 , 3] , [ 1114833600000 , 3] , [ 1117512000000 , 3] , [ 1120104000000 , 4] , [ 1122782400000 , 4] , [ 1125460800000 , 4] , [ 1128052800000 , 4] , [ 1130734800000 , 4] , [ 1133326800000 , 5] , [ 1136005200000 , 3] , [ 1138683600000 , 3] , [ 1141102800000 , 3] , [ 1143781200000 , 2] , [ 1146369600000 , 2] , [ 1149048000000 , 2] , [ 1151640000000 , 3] , [ 1154318400000 , 3] , [ 1156996800000 , 3] , [ 1159588800000 , 2] , [ 1162270800000 , 2] , [ 1164862800000 , 2] , [ 1167541200000 , 1] , [ 1170219600000 , 1] , [ 1172638800000 , 1] , [ 1175313600000 , 2] , [ 1177905600000 , 2] , [ 1180584000000 , 2] , [ 1183176000000 , 3] , [ 1185854400000 , 3] , [ 1188532800000 , 3] , [ 1191124800000 , 4] , [ 1193803200000 , 4] , [ 1196398800000 , 4] , [ 1199077200000 , 5] , [ 1201755600000 , 5] , [ 1204261200000 , 5] , [ 1206936000000 , 3] , [ 1209528000000 , 3] , [ 1212206400000 , 3] , [ 1214798400000 , 4] , [ 1217476800000 , 4] , [ 1220155200000 , 4] , [ 1222747200000 , 3] , [ 1225425600000 , 3] , [ 1228021200000 , 3] , [ 1230699600000 , 1] , [ 1233378000000 , 1] , [ 1235797200000 , 1] , [ 1238472000000 , 0] , [ 1241064000000 , 0] , [ 1243742400000 ,2] , [ 1246334400000 , 2] , [ 1249012800000 , 2] , [ 1251691200000 , 2] , [ 1254283200000 , 1] , [ 1256961600000 , 1] , [ 1259557200000 , 1] , [ 1262235600000 , 0] , [ 1264914000000 , 0] , [ 1267333200000 , 0] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0] , [ 1288497600000 , 1] , [ 1291093200000 , 1] , [ 1293771600000 , 1] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 2] , [ 1317355200000 , 0] , [ 1320033600000 , 0] , [ 1322629200000 , 0] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0]]
		}

	];


	var timeline= [  1025409600000 ,  1028088000000 ,  1030766400000 , 1033358400000 ,  1036040400000 ,1038632400000 ,  1041310800000 , 1043989200000 ,  1046408400000 ,  1049086800000 ,  1051675200000 , 1054353600000 , 1056945600000 , 1059624000000 , 1062302400000 ,  1064894400000 ,  1067576400000 ,1070168400000 ,  1072846800000 ,  1075525200000 ,  1078030800000 ,  1080709200000 , 1083297600000 ,  1085976000000 , 1088568000000 ,  1091246400000 ,  1093924800000 ,  1096516800000 ,  1099195200000 ,  1101790800000 ,  1104469200000 ,  1107147600000 ,  1109566800000 ,1112245200000 , 1114833600000 ,  1117512000000 ,  1120104000000 ,  1122782400000 ,  1125460800000 ,  1128052800000 ,  1130734800000 ,  1133326800000 ,  1136005200000 , 1138683600000 ,  1141102800000 , 1143781200000 ,  1146369600000 , 1149048000000 ,  1151640000000 ,  1154318400000 ,  1156996800000 ,  1159588800000 ,  1162270800000 ,  1164862800000 ,  1167541200000 ,  1170219600000 ,  1172638800000 ,  1175313600000 , 1177905600000 ,  1180584000000 ,  1183176000000 ,  1185854400000 ,  1188532800000 ,  1191124800000 ,  1193803200000 ,  1196398800000 ,  1199077200000 , 1201755600000 , 1204261200000 ,  1206936000000 ,  1209528000000 ,  1212206400000 ,  1214798400000 ,  1217476800000 ,  1220155200000 ,  1222747200000 ,  1225425600000 ,  1228021200000 ,  1230699600000 ,  1233378000000 ,  1235797200000 ,  1238472000000 ,  1241064000000 ,  1243742400000 ,  1246334400000 ,  1249012800000 ,  1251691200000 ,  1254283200000 ,  1256961600000 ,  1259557200000 ,  1262235600000 ,  1264914000000 ,  1267333200000 ,  1270008000000 ,  1272600000000 ,  1275278400000 ,  1277870400000 ,  1280548800000 ,  1283227200000 ,  1285819200000 ,  1288497600000 ,  1291093200000 ,  1293771600000 ,  1296450000000 ,  1298869200000 ,  1301544000000 ,  1304136000000 ,  1306814400000 ,  1309406400000 ,  1312084800000 ,  1314763200000 ,  1317355200000 ,  1320033600000 ,  1322629200000 ,  1325307600000 , 1327986000000 , 1330491600000 ,  1333166400000 ,  1335758400000 ];


/*})();*/



