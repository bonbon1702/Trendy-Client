/**
 * Created by tuan on 11/6/2014.
 */
(function(angular) {
    angular.module('MyApp')
        .factory('trendyService', trendyService);

    trendyService.$inject = ['$http', '$rootScope'];

    function trendyService($http, $rootScope){
        return {
            getPostTrendy: function (data) {
                return $http.get($rootScope.url + 'post/getPostTrendy/paging/' + data.id);
            },
            getAllTagContent: function(){
                return $http.get($rootScope.url + 'tagContent');
            }
        }
    }
})(angular);
