angular.module('app.helpers', []).
factory('Constants', ['$http', function($http){
	return{
		URL_CONSULTAR_COMPARENDO:'notificacion/webresources/consulta/placa',

	}
}]);