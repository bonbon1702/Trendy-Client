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
        $scope.postsThirdRow = [];
        $scope.postsFourthRow= [];
        $scope.postsFifthRow=[];
        $scope.busy = false;
        $scope.newFeedType = 'trend';

        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
            })
            .error();

        angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

        var loadPage = function () {
            headerService.loginUser()
                .success(function (data) {
                    var length = $scope.postsLeft.length + $scope.postsRight.length;
                    if (data.user) {
                        var data = {
                            'order': $scope.newFeedType,
                            'id': length,
                            'user_id': data.user.id
                        };
                    } else {
                        var data = {
                            'order': $scope.newFeedType,
                            'id': length,
                            'user_id': 'none'
                        };
                    }

                    if ($scope.busy) return;
                    $scope.busy = true;

                    newfeedService.getPost(data)
                        .success(function (data) {
                            if (data.posts.length != 0) {
                                for (var i = 0; i < data.posts.length; i += 5) {
                                    if (data.posts[i] != null) {
                                        $scope.postsLeft.push(data.posts[i]);
                                    }
                                    if (data.posts[i + 1] != null) {
                                        $scope.postsRight.push(data.posts[i + 1]);
                                    }
                                    if (data.posts[i + 2] != null) {
                                        $scope.postsThirdRow.push(data.posts[i + 2]);
                                    }
                                    if (data.posts[i + 3] != null) {
                                        $scope.postsFourthRow.push(data.posts[i + 3]);
                                    }
                                    if (data.posts[i + 4] != null) {
                                        $scope.postsFifthRow.push(data.posts[i + 4]);
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
                })
                .error();
        };

        $scope.sideBar = function (type) {
            $scope.newFeedType = type;
            $scope.postsLeft = [];
            $scope.postsRight = [];
            $scope.postsThirdRow=[];
            $scope.postsFourthRow=[];
            $scope.postsFifthRow=[];
            $scope.busy = false;
            loadPage();
        };

        $scope.nextPage = function () {
            loadPage();
        };

        $scope.showDialog = function (id) {
            ngDialog.open({
                template: 'app/newfeed/templates/newfeed.html',
                className: 'ngdialog-theme-plain post-dialog',
                controller: ['$scope', 'newfeedService', '$window', 'headerService', '$pusher', function ($scope, newfeedService, $window, headerService, $pusher) {
                    $scope.iconLike = false;
                    $scope.iconFavorite = false;

                    newfeedService.get(id)
                        .success(function (data) {
                            $scope.post = data.post;

                            var client = new Pusher('4c33474dc0a36d3a912d');
                            var pusher = $pusher(client);
                            var my_channel = pusher.subscribe('real-time');
                            my_channel.bind('comment-post',
                                function (data) {
                                    if (data.comment.user_id != $scope.loginUser.id) {
                                        $scope.post.comments.push(data.comment);
                                    }
                                }
                            );

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
                                        for (var i = 0; i< $scope.post.favorite.length; i++){
                                            if ($scope.post.favorite[i].user_id == $scope.loginUser.id){
                                                $scope.iconFavorite = true;
                                                break;
                                            } else {
                                                $scope.iconFavorite = false;
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
                                    $scope.post.comments.push({
                                        'content': data.content,
                                        'created_at': 'Just now',
                                        'user': {
                                            'username': $scope.loginUser.username,
                                            'id': $scope.loginUser.id,
                                            'picture_profile': $scope.loginUser.picture_profile
                                        }
                                    });
                                    newfeedService.save(data)
                                        .success(function (data) {
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

                                    if ($scope.iconLike == true) {
                                        $scope.post.like.length--;
                                        $scope.iconLike = false;
                                    } else {
                                        $scope.post.like.length++;
                                        $scope.iconLike = true;
                                    }

                                    newfeedService.likeOrDislike(data)
                                        .success(function (data) {


                                        })
                                        .error(function (data) {

                                        });
                                }
                            };

                            $scope.favorite = function(){
                                if (!$scope.loginUser) {
                                    event.preventDefault();
                                    headerService.openLogin();
                                } else {
                                    var data = {
                                        post_id: id,
                                        type: $scope.iconFavorite == true ? 'unFavorite' : 'favorite',
                                        user_id: $scope.loginUser.id
                                    };
                                    console.log(data);
                                    if ($scope.iconFavorite == true) {
                                        $scope.iconFavorite = false;
                                    } else {
                                        $scope.iconFavorite = true;
                                    }

                                    newfeedService.favoritePost(data)
                                        .success(function (data) {

                                        })
                                        .error(function (data) {

                                        });
                                }
                            };

                            $scope.closeDialog = function () {
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
