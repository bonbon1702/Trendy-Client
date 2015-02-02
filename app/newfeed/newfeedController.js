/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('newfeedController', newfeedController);

    newfeedController.$inject = ['$scope', 'newfeedService', 'ngDialog', 'headerService'];

    function newfeedController($scope, newfeedService, ngDialog, headerService) {
        $scope.comment = null;
        $scope.postsLeft = [];
        $scope.postsRight = [];
        $scope.busy = false;

        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
            })
            .error();

        angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

        $scope.nextPage = function () {
            var length = $scope.postsLeft.length + $scope.postsRight.length;
            if ($scope.busy) return;
            $scope.busy = true;
            newfeedService.getPost(length)
                .success(function (data) {
                    if (data.posts.length != 0) {
                        for (var i = 0; i < data.posts.length; i += 2) {
                            if (data.posts[i] != null) {
                                $scope.postsLeft.push(data.posts[i]);
                            }
                            if (data.posts[i + 1] != null) {
                                $scope.postsRight.push(data.posts[i + 1]);
                            }
                        }
                        $scope.busy = false;
                    } else {
                        $scope.busy = true;
                    }
                })
                .error(function (data) {
                    console.log(data);
                });
        };

        $scope.showDialog = function (id) {
            ngDialog.open({
                template: 'app/newfeed/templates/newfeed.html',
                className: 'ngdialog-theme-plain post-dialog',
                controller: ['$scope', 'newfeedService', '$window', 'headerService', function ($scope, newfeedService, $window, headerService) {
                    $scope.iconLike = false;

                    headerService.loginUser()
                        .success(function (data) {
                            $scope.loginUser = data.user;
                        })
                        .error();

                    newfeedService.get(id)
                        .success(function (data) {
                            $scope.post = data.post;

                            $scope.tags = [];
                            for (var i = 0; i < $scope.post.tag.length; i++) {
                                $scope.tags.push({
                                    'text': $scope.post.tag[i].tag_content.content
                                });
                            }

                            $scope.hoverPoint = function (index) {
                                angular.element(document).find('div .magiccard span .item-tag-label').each(function () {
                                    var ele = angular.element($(this));
                                    if (ele.html() == index) {
                                        ele.parent().addClass('bounce');
                                    }
                                })
                            };

                            $scope.leavePoint = function (index) {
                                angular.element(document).find('div .magiccard span .item-tag-label').each(function () {
                                    var ele = angular.element($(this));
                                    if (ele.html() == index) {
                                        ele.parent().removeClass('bounce');
                                    }
                                })
                            };

                            $scope.submitComment = function () {
                                if (!$scope.loginUser) {
                                    event.preventDefault();
                                    headerService.openLogin();
                                } else {
                                    var data = {
                                        'content': $scope.comment,
                                        'type_comment': 0,
                                        'type_id': id,
                                        'user_id': $scope.loginUser.id
                                    };
                                    $scope.comment = null;
                                    newfeedService.save(data)
                                        .success(function (data) {
                                            $scope.post.comments.push(data.comment);
                                        })
                                        .error(function (data) {

                                        });
                                }
                            };

                            $scope.likeOrDislike = function () {
                                if (!$scope.loginUser) {
                                    event.preventDefault();
                                    headerService.openLogin();
                                } else {
                                    var data = {
                                        id: id,
                                        type: $scope.iconLike == true ? 0 : 1,
                                        user: $scope.loginUser.id
                                    };

                                    newfeedService.likeOrDislike(data)
                                        .success(function (data) {
                                            if ($scope.iconLike == true) {
                                                $scope.post.like.length--;
                                                $scope.iconLike = false;
                                            } else {
                                                $scope.post.like.length++;
                                                $scope.iconLike = true;
                                            }

                                        })
                                        .error(function (data) {

                                        });
                                }
                            };

                            if ($scope.loginUser) {
                                for (var i = 0; i < $scope.post.like.length; i++) {

                                    if ($scope.post.like[i].user_id == $scope.loginUser.id) {
                                        $scope.iconLike = true;
                                    } else {
                                        $scope.iconLike = false;
                                    }
                                }
                            }
                            console.log($scope,post.like, $scope.loginUser.id)

                        })
                        .error(function (data) {

                        });
                }]
            });
        };
    }
})(angular);
