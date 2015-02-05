/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('userController', userController);

    userController.$inject = ['$scope', 'ngDialog', '$routeParams', 'userService'];

    function userController($scope, ngDialog, $routeParams, userService) {
        $scope.following = [];
        $scope.follower = [];
        userService.getUser($routeParams.userId)
            .success(function (data) {
                $scope.user = data.user;
                if (data.user.following.length != 0 && data.user.following.length != 0) {
                    for (var i = 0; i < data.user.following.length; i += 1) {
                        $scope.following.push(data.user.following[i]);
                    }
                    for (var i = 0; i < data.user.follower.length; i += 1) {
                        $scope.follower.push(data.user.follower[i]);
                    }
                }

            })
            .error(function (data) {
                console.log(data);
            });
    }
})(angular);
