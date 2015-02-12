/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('userController', userController);

    userController.$inject = ['$scope', 'ngDialog', '$routeParams', 'userService', 'headerService'];

    function userController($scope, ngDialog, $routeParams, userService, headerService) {
        $scope.flwBtnLbl = 'Follow';
        userService.getUser($routeParams.userId)
            .success(function (data) {
                $scope.following = [];
                $scope.follower = [];
                $scope.user = data.user;
                $scope.show = true;

                if (data.user.follower.length > 0) {
                    for (var i = 0; i < data.user.follower.length; i += 1) {
                        $scope.follower.push(data.user.follower[i]);
                        $scope.follower[i].status = 'Follow';
                        for (var j = 0; j < data.user.following.length; j += 1) {
                            if ($scope.following.length < data.user.following.length && data.user.following[j] != null) {
                                $scope.following.push(data.user.following[j]);
                                $scope.following[j].status = 'Following';
                            }
                            if ($scope.follower[i].follower_id == $scope.following[j].user_id) {
                                $scope.follower[i].status = 'Following';
                            }
                        }
                    }
                } else {
                    for (var j = 0; j < data.user.following.length; j += 1) {
                        if (data.user.following[j] != null) {
                            $scope.following.push(data.user.following[j]);
                            $scope.following[j].status = 'Following';
                        }
                    }
                }
            })
            .error(function (data) {
                console.log(data);

            });

        headerService.loginUser()
            .success(function (data) {
                $scope.loginUserId = data.user.id;
                headerService.getUser($scope.loginUserId)
                    .success(function (data) {
                        $scope.flwBtnStatus = false;
                        for (var j = 0; j < data.user.following.length; j += 1) {
                            if (data.user.following[j].user_id == $routeParams.userId || $scope.loginUserId == $routeParams.userId) {
                                $scope.flwBtnStatus = true;
                            }
                        }
                    })
                    .error(function (data) {
                        console.log(data);

                    });
            })
            .error(function (data) {
                console.log(data);
            });

        $scope.flwBtnClick=function(){
            var data;
            if ($scope.flwBtnLbl == 'Follow') {
                data = {
                    user_id: $routeParams.userId,
                    follower_id: $scope.loginUserId
                };
                userService.addFollow(data)
                    .success(function () {
                        $scope.flwBtnLbl = 'Following';
                    })
                    .error(function (data) {
                        console.log(data);
                    })
            } else if ($scope.flwBtnLbl == 'Following') {
                data = {
                    user_id: $routeParams.userId,
                    follower_id: $scope.loginUserId
                };
                userService.removeFollow(data)
                    .success(function () {
                        $scope.flwBtnLbl= 'Follow';
                    })
                    .error(function () {
                        console.log(data);
                    })
            }
        }

        $scope.showTabAlbum = function (data) {
            $scope.show = false;
            $scope.index = data;
        }

        $scope.setShowInitValue = function () {
            $scope.show = true;
        }

        $scope.followBtnClick = function (user) {
            var data;
            if (user.status == 'Follow') {
                data = {
                    user_id: user.follower_id,
                    follower_id: $routeParams.userId
                };
                userService.addFollow(data)
                    .success(function () {
                        user.status = 'Following';
                        var flwing = user;
                        $scope.following.push(flwing);
                        $scope.user.following.length++;

                    })
                    .error(function (data) {
                        console.log(data);
                    })
            } else if (user.status == 'Following') {
                data = {
                    user_id: parseInt($routeParams.userId),
                    follower_id: user.follower_id
                };
                userService.removeFollow(data)
                    .success(function () {
                        user.status = 'Follow';
                        var flwing = user;
                        $scope.following.splice(flwing);
                        $scope.user.following.length--;
                        console.log($scope.user.following.length);
                    })
                    .error(function () {
                        console.log(data);
                    })
            }
        }

        $scope.followingBtnClick = function (user) {

            if (user.status == 'Follow') {
                data = {
                    user_id: user.user_id,
                    follower_id: $routeParams.userId
                };
                userService.addFollow(data)
                    .success(function () {
                        user.status = 'Following';
                        var flwing = user;
                        $scope.following.push(flwing);
                        $scope.user.following.length++;

                    })
                    .error(function (data) {
                        console.log(data);
                    })
            } else if (user.status == 'Following') {
                data = {
                    user_id: parseInt($routeParams.userId),
                    follower_id: user.user_id
                };

                userService.removeFollow(data)
                    .success(function () {
                        user.status = 'Follow';
                        var flwing = user;
                        $scope.user.following.length--;
                        console.log($scope.following);
                    })
                    .error(function () {
                        console.log(data);
                    })
            }
        }

        $scope.showDialog = function (id) {
            ngDialog.open({
                template: 'app/newfeed/templates/newfeed.html',
                className: 'ngdialog-theme-plain post-dialog',
                controller: ['$scope', 'newfeedService', '$window', 'headerService', function ($scope, newfeedService, $window, headerService) {
                    $scope.iconLike = false;



                    newfeedService.get(id)
                        .success(function (data) {
                            $scope.post = data.post;

                            headerService.loginUser()
                                .success(function (data) {
                                    $scope.loginUser = data.user;
                                    if ($scope.loginUser) {
                                        for (var i = 0; i < $scope.post.like.length; i++) {
                                            if ($scope.post.like[i].user_id == $scope.loginUser.id) {
                                                $scope.iconLike = true;
                                                break;
                                            } else {
                                                $scope.iconLike = false;
                                            }
                                        }
                                    }
                                })
                                .error();

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

                            $scope.closeDialog = function(){
                                ngDialog.close();
                            }
                        })
                        .error(function (data) {

                        });
                }]
            });
        };


    }
})(angular);
