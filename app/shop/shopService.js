/**
 * Created by tuan on 11/6/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('shopService', shopService);
    shopService.$inject = ['$http', '$rootScope'];

    function shopService($http, $rootScope) {
        return {
            list: function () {

            }
        }
    }
})(angular);
