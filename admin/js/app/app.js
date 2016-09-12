var app = angular.module("DeployerND",["ngRoute"]);
var socket = io();
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
app.controller("JobController",function($scope,$http,HomeService,$rootScope,$location){
	$scope.isLogged = false;
	$scope.isSingle = false;
	$scope.jobs = [];
	$scope.id = 0;
	$rootScope.$on("logged",function(){
		$scope.isLogged = HomeService.isLogged();
		$http.get('/job').then(function(response){
			$scope.jobs = response.data;
		});
	});
	$scope.esegui = function(id){
		$scope.isSingle = true;
		$scope.id = id;
		$http.get('/job/'+id+'/home').then(function(response){
			$scope.jobb = response.data;
		});
	}
	$scope.play = function(id){
		socket.emit("exe",{id:id});
		socket.on("ese",function(dati){
			var div = document.getElementById('log');
			var p = document.createElement("P");
			p.innerHTML = "[Server] "+dati;
			div.append(p);
		});
	}
});