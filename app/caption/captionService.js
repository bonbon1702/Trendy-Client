/**
 * Created by tuan on 12/30/2014.
 */
(function(angular){
    angular.module('MyApp')
        .factory('captionService', captionService);

    captionService.$inject = ['$http', '$rootScope'];
    function captionService($http, $rootScope){
        return {
            save : function(data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'post',
                    data: data
                });
            },
            update : function(data){
                return $http({
                    method: 'GET',
                    url: $rootScope.url +'shop/searchShop/' + data.type,
                    ignoreLoadingBar: true
                });
            },
            get: function(data){
                return $http.get($rootScope.url + 'upload/' + data);
            },
            upload: function(data){
                console.log(data);
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'uploadEditor',
                    data: data
                });
            }
        }
    }
})(angular);
