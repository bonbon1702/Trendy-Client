/**
 * Created by nghia on 03/04/2015.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('postDetailController', postDetailController);

    postDetailController.$inject = ['$scope', 'postService', '$location', '$routeParams', 'headerService', '$window'];

    function postDetailController($scope, postService, $location, $routeParam, headerService, $window) {
        $scope.iconLike = false;
        $scope.iconFavorite = false;
        $scope.editing = false;
        $scope.editingComment = false;

        postService.getPost($routeParam.id)
            .success(function(data){
                $scope.post = data.post;
                $scope.post.created_at = beautyDate.prettyDate($scope.post.created_at);
                for (var i=0; i< $scope.post.tag_picture.length; i++){
                    $scope.post.tag_picture[i].top = $scope.post.tag_picture[i].top - 20;
                }
                for (var i=0; i< $scope.post.comments.length; i++){
                    $scope.post.comments[i].created_at = beautyDate.prettyDate($scope.post.comments[i].created_at);
                }
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
                            for (var i = 0; i < $scope.post.favorite.length; i++) {
                                if ($scope.post.favorite[i].user_id == $scope.loginUser.id) {
                                    $scope.iconFavorite = true;
                                    break;
                                } else {
                                    $scope.iconFavorite = false;
                                }
                            }
                        }
                    })
                    .error();

                $scope.submitComment = function () {
                    if (!$scope.loginUser) {
                        event.preventDefault();
                        headerService.openLogin();
                    } else {
                        var data = {
                            'content': this.comment,
                            'type_comment': 0,
                            'type_id': $routeParam.id,
                            'user_id': $scope.loginUser.id
                        };
                        this.comment = null;
                        //$scope.post.comments.push({
                        //    'content': data.content,
                        //    'created_at': 'Just now',
                        //    'user': {
                        //        'username': $scope.loginUser.username,
                        //        'id': $scope.loginUser.id,
                        //        'picture_profile': $scope.loginUser.picture_profile
                        //    }
                        //});

                        postService.saveComment(data)
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
                            id: $routeParam.id,
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

                        postService.likeOrDislike(data)
                            .success(function (data) {


                            })
                            .error(function (data) {

                            });
                    }
                };

                $scope.favorite = function () {
                    if (!$scope.loginUser) {
                        event.preventDefault();
                        headerService.openLogin();
                    } else {
                        var data = {
                            post_id: $routeParam.id,
                            type: $scope.iconFavorite == true ? 'unFavorite' : 'favorite',
                            user_id: $scope.loginUser.id
                        };

                        if ($scope.iconFavorite == true) {
                            $scope.post.favorite.length--;
                            $scope.iconFavorite = false;
                        } else {
                            $scope.post.favorite.length++;
                            $scope.iconFavorite = true;
                        }

                        postService.favoritePost(data)
                            .success(function (data) {

                            })
                            .error(function (data) {
                                console.log(data);
                            });
                    }
                };

                $scope.editComment = function (index, content) {
                    $scope.post.comments[index].editing = 'yes';
                    $scope.editContent = content;
                };

                $scope.submitEditComment = function (index) {
                    $scope.post.comments[index].content = this.editContent;
                    $scope.post.comments[index].editing = null;
                    postService.editPostComment({
                        id: $scope.post.comments[index].id,
                        content: this.editContent
                    }).success(function (data) {

                    }).error();
                };

                $scope.deleteCommentIndex = function (index) {

                    postService.deletePostComment({
                        id: $scope.post.comments[index].id
                    }).success(function (data) {

                    }).error();
                    $scope.post.comments.splice(index, 1);
                };

                $scope.closeEditComment = function (index) {
                    $scope.post.comments[index].editing = null;
                };

                $scope.editPost = function () {
                    $scope.editing = true;
                };

                $scope.submitCaption = function () {
                    $scope.post.caption = this.editCaption;
                    $scope.editing = false;

                    postService.editPostCaption({
                        id: $routeParam.id,
                        caption: this.editCaption
                    }).success(function (data) {

                    }).error(function (data) {
                        console.log(data);
                    });
                };

                $scope.closeEdit = function () {
                    $scope.editing = false;
                };

                $scope.deletePostInside = function () {
                    postService.delete({
                        id: $routeParam.id
                    }).success(function (data) {
                        $window.location.reload();
                    }).error();
                };

                $scope.closeDialog = function () {
                    ngDialog.close();
                };

                var socket = io.connect('http://103.7.40.222:3000/');

                socket.on('realTime.comment', function (data) {
                    //Do something with data
                    var results = JSON.parse(data);
                    if (results.type_comment == 0 && results.type_id == $routeParam.id) {
                        results['created_at'] = beautyDate.prettyDate(results['created_at']);
                        $scope.post.comments.push(results);
                        //$scope.sound = ngAudio.load("../assets/sound/beep.mp3");
                        //$scope.sound.play();
                    }
                });
            }).error();
    }
})(angular);