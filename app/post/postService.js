/**
 * Created by tuan on 12/30/2014.
 */
(function(angular) {
    angular.module('MyApp')
        .factory('postService', postService);

    postService.$inject = ['$http', '$rootScope'];

    function postService($http, $rootScope){
        return {
            list: function(){
                return $http.get($rootScope.url + 'post');
            }
        }
    }
})(angular);

