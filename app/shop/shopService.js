/**
 * Created by tuan on 11/6/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('shopService', shopService);
    shopService.$inject = ['$http', '$rootScope'];

    function shopService($http, $rootScope) {
        return {
            get: function(id) {
                return $http.get($rootScope.url + 'shop/getShop/' + id);
            },
            save: function(data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'comment/saveComment',
                    data: data
                })
            },
            likeOrDislike: function(data) {
                if (hello("google").getAuthResponse() != null) {
                    var nw = hello("google").getAuthResponse();
                } else if (hello("facebook").getAuthResponse() != null) {
                    var nw = hello("facebook").getAuthResponse();
                } else if (hello("twitter").getAuthResponse() != null) {
                    var nw = hello("twitter").getAuthResponse();
                }
                if (nw){
                    data['token'] = nw.access_token;
                    return $http({
                        method: 'POST',
                        url: $rootScope.url + 'like/likeShop',
                        data: data,
                        ignoreLoadingBar: true
                    });
                }
            },
            getShop: function (data) {
                return $http.get($rootScope.url + 'shop/getShop/'+data.shopId+'/paging/' + data.offSet);
            },
            saveShopDetail: function(data){
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'shop/saveShopInfo',
                    data: data
                })
            },
            suggestShop: function(data){
                return $http.get($rootScope.url + 'shop/suggestShop/loginId/'+data.loginId+'/shopId/' + data.shopId);
            },
            editShopComment: function(data){
                return $http.get($rootScope.url + 'comment/editShopComment/id/' + data.id + '/content/' + data.content)
            },
            deleteShopComment: function(data){
                return $http.get($rootScope.url + 'comment/deleteShopComment/id/' + data.id)
            }
        }
    }
})(angular);
