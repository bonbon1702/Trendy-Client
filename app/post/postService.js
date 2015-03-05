/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('postService', postService);

    postService.$inject = ['$http', '$rootScope'];
    function postService($http, $rootScope) {
        return {
            save: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'post',
                    data: data
                });
            },
            update: function (data) {
                return $http({
                    method: 'GET',
                    url: $rootScope.url + 'shop/searchShop/' + data.type,
                    ignoreLoadingBar: true
                });
            },
            get: function (data) {
                return $http.get($rootScope.url + 'upload/' + data);
            },
            upload: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'uploadEditor',
                    data: data
                });
            },
            delete: function (data) {
                return $http({
                    method: 'DELETE',
                    url: $rootScope.url + 'post/delete/'+data.id
                });
            },
            deleteAlbum: function (data) {
                return $http({
                    method: 'DELETE',
                    url: $rootScope.url + 'album/delete/'+data.albName
                });
            },
            editAlbumName: function(data){
                return $http({
                    method: 'PUT',
                    url: $rootScope.url + 'album/' +data.id,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT,DELETE',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': '*'
                    },
                    params: {
                        album_name:data['album_name']
                    }
                });
            }
        }
    }
})(angular);
