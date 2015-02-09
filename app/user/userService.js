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
                return $http({
                    method: 'DELETE',
                    url: $rootScope.url + 'following/delete',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT,DELETE',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': '*'
                    },
                    params: {
                        user_id:data['user_id'],
                        follower_id:data['follower_id']
                    }
                });
            }
        }
    }
})(angular);
