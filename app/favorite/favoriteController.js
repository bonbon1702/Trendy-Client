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
                if (!data.user){
                    headerService.openLogin();
                    event.stopPropagation();
                    event.preventDefault();
                } else {
                    $scope.loginUser = data.user;
                    var data = {
                        id: 0,
                        'user_id': $scope.loginUser.id
                    };

                    favoriteService.getPostFavorite(data)
                        .success(function (data) {
                            headerService.loginUser()
                                .success(function (r) {
                                    if (r.user) {
                                        for (var i = 0; i < data.posts.length; i++) {
                                            if (data.posts[i].like.length > 0) {
                                                for (var j = 0; j < data.posts[i].like.length; j++) {
                                                    if (data.posts[i].like[j].user_id == r.user.id) {
                                                        data.posts[i].isLike = true;
                                                        break;
                                                    } else {
                                                        data.posts[i].isLike = false;
                                                    }
                                                }
                                            } else {
                                                data.posts[i].isLike = false;
                                            }

                                            if (data.posts[i].favorite.length > 0) {
                                                for (var j = 0; j < data.posts[i].favorite.length; j++) {
                                                    if (data.posts[i].favorite[j].user_id == r.user.id) {
                                                        data.posts[i].isFavorite = true;
                                                        break;
                                                    } else {
                                                        data.posts[i].isFavorite = false;
                                                    }
                                                }
                                            } else {
                                                data.posts[i].isFavorite = false;
                                            }
                                        }
                                    } else {
                                        for (var i = 0; i < data.posts.length; i++) {
                                            data.posts[i].isLike = false;
                                            data.posts[i].isFavorite = false;
                                        }
                                    }
                                })
                                .error();
                            $scope.posts = data.posts;
                        })
                        .error(function (data) {
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
                                'id': length,
                                'user_id': $scope.loginUser.id
                            };

                            if ($scope.busy) return;
                            $scope.busy = true;

                            favoriteService.getPostFavorite(data)
                                .success(function (data) {
                                    if (data.posts.length != 0) {
                                        headerService.loginUser()
                                            .success(function (r) {
                                                if (r.user) {
                                                    for (var i = 0; i < data.posts.length; i++) {
                                                        if (data.posts[i].like.length > 0) {
                                                            for (var j = 0; j < data.posts[i].like.length; j++) {
                                                                if (data.posts[i].like[j].user_id == r.user.id) {
                                                                    data.posts[i].isLike = true;
                                                                    break;
                                                                } else {
                                                                    data.posts[i].isLike = false;
                                                                }
                                                            }
                                                        } else {
                                                            data.posts[i].isLike = false;
                                                        }

                                                        if (data.posts[i].favorite.length > 0) {
                                                            for (var j = 0; j < data.posts[i].favorite.length; j++) {
                                                                if (data.posts[i].favorite[j].user_id == r.user.id) {
                                                                    data.posts[i].isFavorite = true;
                                                                    break;
                                                                } else {
                                                                    data.posts[i].isFavorite = false;
                                                                }
                                                            }
                                                        } else {
                                                            data.posts[i].isFavorite = false;
                                                        }
                                                    }
                                                } else {
                                                    for (var i = 0; i < data.posts.length; i++) {
                                                        data.posts[i].isLike = false;
                                                        data.posts[i].isFavorite = false;
                                                    }
                                                }
                                            })
                                            .error();
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


                    $scope.likeOrDislikePost = function (id, isLike) {
                        if (!$scope.loginUser) {
                            event.preventDefault();
                            headerService.openLogin();
                        } else {
                            var data = {
                                id: id,
                                type: isLike == true ? 0 : 1,
                                user: $scope.loginUser.id
                            };



                            if (isLike == true) {
                                for (var i=0; i< $scope.posts.length; i++){
                                    if ($scope.posts[i].id == id){
                                        $scope.posts[i].like.length--;
                                        $scope.posts[i].isLike = false;
                                    }
                                }
                            } else {
                                for (var i=0; i< $scope.posts.length; i++){
                                    if ($scope.posts[i].id == id){
                                        $scope.posts[i].like.length++;
                                        $scope.posts[i].isLike = true;
                                    }
                                }
                            }



                            postService.likeOrDislike(data)
                                .success(function (data) {


                                })
                                .error(function (data) {

                                });
                        }
                    };

                    $scope.favoriteOrUn = function(id, isFavorite) {
                        if (!$scope.loginUser) {
                            event.preventDefault();
                            headerService.openLogin();
                        } else {
                            var data = {
                                post_id: id,
                                type: isFavorite == true ? 'unFavorite' : 'favorite',
                                user_id: $scope.loginUser.id
                            };

                            if (isFavorite == true) {
                                for (var i = 0; i < $scope.posts.length; i++) {
                                    if ($scope.posts[i].id == id) {
                                        $scope.posts[i].favorite.length--;
                                        $scope.posts[i].isFavorite = false;
                                    }
                                }
                            } else {
                                for (var i = 0; i < $scope.posts.length; i++) {
                                    if ($scope.posts[i].id == id) {
                                        $scope.posts[i].favorite.length++;
                                        $scope.posts[i].isFavorite = true;
                                    }
                                }
                            }


                            postService.favoritePost(data)
                                .success(function (data) {


                                })
                                .error(function (data) {

                                });
                        }
                    };
                }
            })
            .error();
    }
})(angular);

