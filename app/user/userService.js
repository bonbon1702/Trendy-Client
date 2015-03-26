/**
 * Created by tuan on 11/6/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('userService', userService);

    userService.$inject = ['$http', '$rootScope'];

    function userService($http, $rootScope) {
        return {
            getUser: function (data) {
                return $http.get($rootScope.url + 'user/getUser/' + data);
            },
            addFollow: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'follow',
                    data: data
                });
            },
            removeFollow: function (data) {
                return $http.get($rootScope.url + 'following/delete/userID/' + data.user_id + '/followerID/' + data.follower_id);
            },

            updateCover : function(data){
                return $http({
                    method: 'PUT',
                    url: $rootScope.url + 'user/' +data.user_id,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT,DELETE',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': '*'
                    },
                    params: {
                        id:data['user_id'],
                        image_cover:data['image_cover']
                    }
                });
            }
        }
    }
})(angular);
