/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('newfeedController', newfeedController);

    newfeedController.$inject = ['$scope', 'newfeedService', 'ngDialog', 'headerService', 'postService'];

    function newfeedController($scope, newfeedService, ngDialog, headerService, postService) {
        $scope.busy = false;
        $scope.posts = [];

        headerService.loginUser()
            .success(function (data) {
                if (!data.user) {
                    headerService.openLogin();
                    event.stopPropagation();
                    event.preventDefault();
                } else {

                    $scope.loginUser = data.user;

                    $scope.openPost = function (id) {
                        postService.openPost(id,'newsfeed');
                    };

                    var data = {
                        'id': 0,
                        'user_id': $scope.loginUser.id
                    };

                    if ($scope.busy) return;
                    $scope.busy = true;

                    newfeedService.getPostNewFeed(data)
                        .success(function (data) {
                            if (data.posts.length != 0) {
                                for (var i = 0; i < data.posts.length; i++) {
                                    $scope.posts.push(data.posts[i]);
                                }

                                $scope.busy = false;
                            } else {
                                $scope.busy = true;
                            }

                            for (var i = 0; i< $scope.posts.length; i++){
                                $scope.posts[i].time_created = beautyDate.prettyDate($scope.posts[i].time_created);
                            }

                        })
                        .error(function (data) {
                            console.log(data);
                        });

                    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

                    $scope.nextPage = function () {
                        var length = $scope.posts.length;

                        var data = {
                            'id': length,
                            'user_id': $scope.loginUser.id
                        };

                        if ($scope.busy) return;
                        $scope.busy = true;

                        newfeedService.getPostNewFeed(data)
                            .success(function (data) {
                                if (data.posts.length != 0) {
                                    for (var i = 0; i < data.posts.length; i++) {
                                        data.posts[i].time_created = beautyDate.prettyDate(data.posts[i].time_created);
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
                }
            })
            .error();


    }
})(angular);
