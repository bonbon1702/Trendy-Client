/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('editorService', editorService);

    editorService.$inject = ['$http', '$rootScope'];
    function editorService($http, $rootScope) {
        return {
            save: function (data) {
                return $http({
                    method: 'PUT',
                    url: $rootScope.url + 'upload/' +data.name,
                    //headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                    data: data
                });
            },
            get: function(data){
                return $http.get($rootScope.url + 'upload/' + data);
            }
        }
    }
})(angular);
