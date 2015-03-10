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
                return $http.get($rootScope.url + 'shop');
            },
            get: function(id) {
                return $http.get($rootScope.url + 'shop/' + id);
            },
            save: function(data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'comment',
                    data: data
                })
            },
            getComments: function(id) {
                return $http.get($rootScope.url + 'comment/showShop/' + id);
            },
            likeOrDislike: function(data) {
                return $http.get($rootScope.url + 'like/likeShop/' + data.id + '/type/' + data.type + '/user/' + data.user);
            },
            countLike: function(id) {
                return $http.get($rootScope.url + 'like/countLikeShop/' + id);
            },
            getShop: function (data) {
                return $http.get($rootScope.url + 'shop/getShop/'+data.shopId+'/paging/' + data.offSet);
            }
        }
    }
})(angular);
