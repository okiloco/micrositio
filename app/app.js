 (function(){

 angular.module('app.services', []).
 factory('appService', ['$http','$location','Constants',function($http,$location,Constants){
 	var appService={};

 	appService.getModules=function(){
 		var response={};
 		response=$http.get("app/data/modulos.json");
 		return response;
 	}
 	appService.Consultar=function(placa){
 		
 		return $http({
 		  method: 'POST',
 		  url: Constants.URL_CONSULTAR_COMPARENDO,
 		  data:$.param({ placa: placa }),
 		  headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'},
 		});
		
 	}
 	
 	return appService;
 }]);

 angular.module('app.controllers', []).
 controller('loginCtrl', ['$scope','$location', function($scope,$location){
 }]).
 controller('homeCtrl', ['$scope','$location','appService', function($scope,$location,appService){
 	localStorage.clear();
 	
 	$('#search_input').focus();

 	$scope.enviar=function(){
 		if(typeof($scope.placa)!='undefined'){
	 		appService.Consultar($scope.placa).
	 		then(function successCallback(response) {
	 			var result=response.data;
			    appService.data=result.data;
			    if(result.success){
			    	localStorage.setItem("data",JSON.stringify(result.data));
			    	$location.path('/detalle');
			    }else{
			    	$scope.showModal();
			    }
			}, function errorCallback(response) {
				// $scope.showModal();
			});
	 	}
 	}
 	$scope.goback=function(){
 		$location.path('/home');
 	}
 	$scope.showModal=function(){

 		$('#message')
	    .modal({
	    	onHidden:function(){
				$('#search_input').focus();
				$scope.placa="XXX";
			}
	    }).modal('show');
 	}

 }])
 .controller('detalleCtrl', ['$scope','$location','appService', function($scope,$location,appService){
  	// if(typeof(appService)!="undefined"){
  		$scope.show=false;
  		$scope.data=(appService.data || JSON.parse(localStorage.getItem("data")));
  		console.log($scope.data);
  		
  		$scope.Audiencia=function(estado){
  			return (estado=='Audiencia Vinculacion'); 		
  		}

  		$scope.showModal=function(path){

	 		$('#minuta-modal')
		    .modal({
		    	closable:true,
		    	onVisible:function(){
		    		$('.ui.embed').embed({
		    		  url: 'ftp/'+path,
		    		  autoplay:true
		    		});
				}
		    }).modal('show');
  		}

  	// }
 }]);

 angular.module("app",["app.services","app.helpers","app.controllers","ngRoute"])
 .directive('ngEnter', function () {
     return function (scope, element, attrs) {
         element.bind("keydown keypress", function (event) {
             if(event.which === 13) {
                 scope.$apply(function (){
                     scope.$eval(attrs.ngEnter);
                 });
                 event.preventDefault();
             }
         });
     };
 })
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider) {
 	$routeProvider.when("/login",{
 		controller:"loginCtrl",
 		templateUrl:"/app/templates/view-login.html",
 		// requireADLogin:true
 	}).when("/",{
 		controller:"homeCtrl",
 		templateUrl:"/app/templates/view-home.html",
 		// requireADLogin:true
 	}).when("/detalle",{
 		controller:"detalleCtrl",
 		templateUrl:"/app/templates/view-detalle.html",
 		// requireADLogin:true
 	}).
 	otherwise({redirecTo:"/login"});

 }]);

})();