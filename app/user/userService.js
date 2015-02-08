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
            }
        }
    }
})(angular);
