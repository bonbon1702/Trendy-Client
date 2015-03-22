/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('newfeedService', newfeedService);

    newfeedService.$inject = ['$http', '$rootScope'];

    function newfeedService($http, $rootScope) {
        return {
            getPostNewFeed: function (data) {
                return $http.get($rootScope.url + 'post/getPostNewFeed/paging/' + data.id + '/userId/'+ data.user_id);
            }
        }
    }
})(angular);

