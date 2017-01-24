var myApp=angular.module("myApp",[]);

var myController=function($scope){
	$scope.message="hi message";
    $scope.Allnames=[{"Name" : "Mahesh"},{"Name" : "Pushkar"},{"Name" : "Simmin"},{"Name" : "Nikhil"},{"Name" : "tejal"},{"Name" : "yoginee"},{"Name" : "Abhishek"},{"Name" : "Venky"}]
	
};

myApp.controller("myController",myController);