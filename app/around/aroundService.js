/**
 * Created by tuan on 11/6/2014.
 */
(function(angular) {
    angular.module('MyApp')
        .factory('aroundService', aroundService);

    aroundService.$inject = ['$http', '$rootScope'];

    function aroundService($http, $rootScope){
        return {
            getPostAround: function (data) {
                return $http.get($rootScope.url + 'post/getPostAround/paging/' + data.id);
            }
        }
    }
})(angular);
