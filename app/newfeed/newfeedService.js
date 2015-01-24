/**
 * Created by tuan on 12/30/2014.
 */
(function(angular) {
    angular.module('MyApp')
        .factory('newfeedService', newfeedService);

    newfeedService.$inject = ['$http', '$rootScope'];

    function newfeedService($http, $rootScope){
        return {
            list: function(){
                return $http.get($rootScope.url + 'post');
            }
        }
    }
})(angular);

