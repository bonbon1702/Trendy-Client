/**
 * Created by tuan on 11/6/2014.
 */
(function(angular) {
    angular.module('MyApp')
        .factory('favoriteService', favoriteService);

    favoriteService.$inject = ['$http', '$rootScope'];

    function favoriteService($http, $rootScope){
        return {
            getPostFavorite: function (data) {
                return $http.get($rootScope.url + 'post/getPostFavorite/paging/' + data.id);
            }
        }
    }
})(angular);
