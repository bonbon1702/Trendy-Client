/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('favoriteController', favoriteController);

    favoriteController.$inject = ['$scope', 'ngDialog', 'favoriteService', 'headerService', 'userService', 'postService'];

    function favoriteController($scope, ngDialog, favoriteService, headerService, userService, postService) {
        $scope.busy = false;

        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
            })
            .error();
        var data = {
            id: 0
        };
        favoriteService.getPostFavorite(data)
            .success(function(data){
                $scope.posts = data.posts;
            })
            .error(function(data){
                console.log(data);
            });

        $scope.openPost = function(id){
            postService.openPost(id);
        };

        angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

        $scope.nextPage = function(){
            if ($scope.posts) {
                var length = $scope.posts.length;

                var data = {
                    'id': length
                };

                if ($scope.busy) return;
                $scope.busy = true;

                favoriteService.getPostFavorite(data)
                    .success(function (data) {
                        if (data.posts.length != 0) {
                            for (var i =0; i < data.posts.length; i++){
                                $scope.posts.push(data.posts[i]);
                            }

                            $scope.busy = false;
                        } else {
                            $scope.busy = true;
                        }
                    })
                    .error(function (data) {
                        console.log(data);
                    });
            }
        };
    }
})(angular);

