/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('newfeedService', newfeedService);

    newfeedService.$inject = ['$http', '$rootScope'];

    function newfeedService($http, $rootScope) {
        return {
            list: function () {
                return $http.get($rootScope.url + 'post');
            },
            get: function (id) {
                return $http.get($rootScope.url + 'post/' + id);
            },
            save: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'comment',
                    data: data
                });
            },
            getComments: function (id) {
                return $http.get($rootScope.url + 'comment/showPost/' + id)
            },
            likeOrDislike: function (id) {
                return $http.get($rootScope.url + 'like/likePost/' + id);
            },
            countLike: function (id) {
                return $http.get($rootScope.url + 'like/countLikePost/' + id);
            },
            check: function(id){
                return $http.get($rootScope.url + 'like/checkLikePost/' + id);
            }
        }
    }
})(angular);

