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
                    data: data,
                    ignoreLoadingBar: true
                });
            },
            getComments: function (id) {
                return $http.get($rootScope.url + 'comment/showPost/' + id)
            },
            likeOrDislike: function (data) {
                return $http.get($rootScope.url + 'like/likePost/' + data.id+ '/type/' +data.type+ '/user/'+data.user);
            },
            countLike: function (id) {
                return $http.get($rootScope.url + 'like/countLikePost/' + id);
            },
            check: function (id) {
                return $http.get($rootScope.url + 'like/checkLikePost/' + id);
            },
            getPost: function (data) {
                return $http.get($rootScope.url + 'post/getPost/order/' + data.order + '/paging/' + data.id + '/userId/'+ data.user_id);
            },
            favoritePost: function(data){
                return $http.get($rootScope.url + 'favorite/userId/'+ data.user_id + '/postId/' + data.post_id + '/type/' + data.type);
            }
        }
    }
})(angular);

