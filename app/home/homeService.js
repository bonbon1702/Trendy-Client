/**
 * Created by tuan on 11/6/2014.
 */
(function(angular) {
    angular.module('MyApp')
        .factory('homeService', homeService);

    homeService.$inject = ['$http', '$rootScope'];

    function homeService($http, $rootScope){
        return {
            list: function(){
                return $http.get($rootScope.url + 'post');
            }
        }
    }
})(angular);
