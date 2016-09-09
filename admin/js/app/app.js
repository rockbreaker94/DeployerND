var app = angular.module("DeployerND",["ngRoute"]);
app.factory("HomeService",function(){
	var logged = false;
	var setLogged = function(){logged = true;}
	var isLogged = function(){return logged;}
	return{
		setLogged : setLogged,
		isLogged : isLogged
	}
	
});
app.controller("LoginController",function($scope,HomeService,$rootScope){
	$scope.isLogged = false;
	$scope.username = "";
	$scope.password = "";
	$scope.login = function(){
		if($scope.username=="rockbreaker"&&$scope.password=="tuononno94"){
			HomeService.setLogged();
			$scope.isLogged = HomeService.isLogged();
			$rootScope.$emit("logged");
		}
	}
});
app.controller("JobController",function($scope,$http,HomeService,$rootScope){
	$scope.isLogged = false;
	$scope.jobs = [];
	$rootScope.$on("logged",function(){
		$scope.isLogged = HomeService.isLogged();
		$http.get('/job').then(function(response){
			$scope.jobs = response.data;
		});
	});
});