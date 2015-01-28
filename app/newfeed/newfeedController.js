/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('newfeedController', newfeedController);

    newfeedController.$inject = ['$scope', 'newfeedService', 'ngDialog'];

    function newfeedController($scope, newfeedService, ngDialog) {
        $scope.comment = null;
        $scope.postsLeft = [];
        $scope.postsRight = [];
        $scope.busy = false;

        angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

        $scope.loadMore = function(){
            var length = $scope.postsLeft.length + $scope.postsRight.length;
            if ($scope.busy) return;
            $scope.busy = true;
            newfeedService.getPost(length)
                .success(function(data){
                    for (var i = 0; i < data.posts.length; i += 2) {
                        if (data.posts[i] != null) {
                            $scope.postsLeft.push(data.posts[i]);
                        }
                        if (data.posts[i + 1] != null) {
                            $scope.postsRight.push(data.posts[i + 1]);
                        }
                    }
                    $scope.busy = false;
                })
                .error(function(data){
                    console.log(data);
                });
        };

        newfeedService.getPost(0)
            .success(function(data){
                for (var i = 0; i < data.posts.length; i += 2) {
                    if (data.posts[i] != null) {
                        $scope.postsLeft.push(data.posts[i]);
                    }
                    if (data.posts[i + 1] != null) {
                        $scope.postsRight.push(data.posts[i + 1]);
                    }
                }
            })
            .error(function(data){

            });


        $scope.showDialog = function (id) {
            ngDialog.open({
                template: 'app/newfeed/templates/newfeed.html',
                className: 'ngdialog-theme-plain post-dialog',
                controller: ['$scope', 'newfeedService', '$window', function ($scope, newfeedService, $window) {

                    newfeedService.get(id)
                        .success(function (data) {
                            $scope.post = data.post;
                            $scope.points = $scope.post.tag_picture;

                            $scope.submitComment = function () {
                                var data = {
                                    'content': $scope.comment,
                                    'type_comment': 0,
                                    'type_id': id
                                };
                                $scope.comment = null;
                                newfeedService.save(data)
                                    .success(function (data) {
                                        newfeedService.getComments(id)
                                            .success(function (data) {
                                                $scope.post.comments = data.comment;
                                            })
                                            .error(function (data) {

                                            });
                                    })
                                    .error(function (data) {

                                    });
                            };

                            $scope.likeOrDislike = function () {
                                newfeedService.likeOrDislike(id)
                                    .success(function (data) {
                                        newfeedService.countLike(id)
                                            .success(function (data) {
                                                $scope.post.like = data.like;
                                                $scope.iconLike = !$scope.iconLike;
                                            })
                                            .error();
                                    })
                                    .error(function (data) {

                                    });
                            };

                            newfeedService.check(id)
                                .success(function (data) {
                                    $scope.iconLike = data.like;
                                })
                                .error();
                        })
                        .error(function (data) {

                        });
                }]
            });
        };
    }
})(angular);
