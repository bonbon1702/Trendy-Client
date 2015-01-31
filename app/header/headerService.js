/**
 * Created by tuan on 1/20/2015.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('headerService', headerService);

    headerService.$inject = ['$http', '$rootScope', '$upload'];

    function headerService($http, $rootScope, $upload) {
        return {
            save: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'user',
                    data: data
                });
            },
            upload: function (data) {
                return $upload.upload({
                    url: $rootScope.url + 'upload',
                    headers: {'Content-Type': data.type},
                    method: 'POST',
                    file: data,
                    data: data
                });
            },
            getUser: function () {
                return $http.get($rootScope.url + 'user/getLoginUser');
            },
            loginUser: function (data) {
                return $http.get($rootScope.url + 'user/loginUser/' + data);
            },
            logoutUser:function(data){
                return $http.get($rootScope.url + 'user/deleteLogoutUser/' +data);
            }
        }
    }
})(angular);