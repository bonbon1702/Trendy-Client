/**
 * Created by tuan on 11/6/2014.
 */
(function(angular) {
    angular.module('MyApp')
        .factory('homeService', homeService);

    homeService.$inject = ['$http', '$rootScope'];

    function homeService($http, $rootScope){
        return {
            map: function(){
                return $http.get($rootScope.url + 'post');
            },
            getShopList: function(){
                return $http.get($rootScope.url + 'getShopList' );
            }
        }
    }
})(angular);
