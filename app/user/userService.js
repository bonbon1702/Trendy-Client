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
                    url: $rootScope.url + 'follow/addFollowing',
                    data: data
                });
            },
            removeFollow: function (data) {
                return $http.get($rootScope.url + 'following/delete/userID/' + data.user_id + '/followerID/' + data.follower_id);
            },

            updateCover : function(data){
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'user/updateCover',
                    data: {
                        id:data['user_id'],
                        image_cover:data['image_cover']
                    }
                });
            },
            suggestITI : function(data){
                return $http.get($rootScope.url + 'follow/suggestionFollow/loginId/' + data.loginId + '/type/itemToItem/userId/' + data.user_id);
            }
        }
    }
})(angular);
