/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('userController', userController);

    userController.$inject = ['$scope', 'ngDialog', '$routeParams', 'userService'];

    function userController($scope, ngDialog, $routeParams, userService) {
        userService.getUser($routeParams.userId)
            .success(function (data) {
                $scope.user = data.user;
                var countFollowing = 0, countFollower = 0, countPhoto = 0;
                for (var i = 0; i < data.user.following.length; i += 1) {
                    countFollowing++;
                }
                for (var i = 0; i < data.user.follower.length; i += 1) {
                    countFollower++;
                }
                $scope.countFollowing = countFollowing;
                $scope.countFollower = countFollower;
                $scope.posts = [];
                for (var i = 0; i < data.user.posts.length; i += 1) {
                    $scope.posts.push(data.user.posts[i]);
                    countPhoto++;
                    if (i < 6) {
                        $scope.flagAmount = false;
                    }
                }
                $scope.countPhoto = countPhoto;
                console.log($scope.user);
            })
            .error(function () {
                console.log(data);
            });
    }
})(angular);
