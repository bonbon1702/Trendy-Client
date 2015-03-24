/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('trendyController', trendyController);

    trendyController.$inject = ['$scope', 'ngDialog', 'trendyService', 'headerService', 'userService', 'postService'];

    function trendyController($scope, ngDialog, trendyService, headerService, userService, postService) {
        $scope.busy = false;

        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
            })
            .error();
        var data = {
            id: 0
        };
        trendyService.getPostTrendy(data)
            .success(function(data){
                $scope.postsTop3=[];
                $scope.posts=[];
                for (var i =0; i < 3; i++){
                    $scope.postsTop3.push(data.posts[i]);
                }

                for (var j =3; j < data.posts.length; j++){
                    $scope.posts.push(data.posts[j]);
                }
                console.log($scope.posts.length);
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

                trendyService.getPostTrendy(data)
                    .success(function (data) {
                        if (data.posts.length != 0) {
                            for (var j =3; j < data.posts.length; j++){
                                $scope.posts.push(data.posts[j]);
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

