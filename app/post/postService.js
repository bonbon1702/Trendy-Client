/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('postService', postService);

    postService.$inject = ['$http', '$rootScope', 'ngDialog'];
    function postService($http, $rootScope, ngDialog) {
        return {
            save: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'post',
                    data: data
                });
            },
            update: function (data) {
                return $http({
                    method: 'GET',
                    url: $rootScope.url + 'shop/searchShop/' + data.type,
                    ignoreLoadingBar: true
                });
            },
            get: function (data) {
                return $http.get($rootScope.url + 'upload/' + data);
            },
            upload: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'uploadEditor',
                    data: data
                });
            },
            delete: function (data) {
                return $http({
                    method: 'DELETE',
                    url: $rootScope.url + 'post/delete/'+data.id
                });
            },
            deleteAlbum: function (data) {
                return $http({
                    method: 'DELETE',
                    url: $rootScope.url + 'album/delete/'+data.albName
                });
            },
            editAlbumName: function(data){
                return $http({
                    method: 'PUT',
                    url: $rootScope.url + 'album/' +data.id,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT,DELETE',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': '*'
                    },
                    params: {
                        album_name:data['album_name']
                    }
                });
            },
            saveComment: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'comment',
                    data: data,
                    ignoreLoadingBar: true
                });
            },
            likeOrDislike: function (data) {
                return $http.get($rootScope.url + 'like/likePost/' + data.id+ '/type/' +data.type+ '/user/'+data.user);
            },
            favoritePost: function(data){
                return $http.get($rootScope.url + 'favorite/userId/'+ data.user_id + '/postId/' + data.post_id + '/type/' + data.type);
            },
            getPost: function (id) {
                return $http.get($rootScope.url + 'post/' + id);
            },
            loadTag: function (query){
                return $http.get($rootScope.url + 'tagContent');
            },
            openPost: function(id){
                ngDialog.open({
                    template: 'app/post/templates/postDetail.html',
                    className: 'ngdialog-theme-plain post-dialog',
                    controller: ['$scope', 'newfeedService', '$window', 'headerService','postService', function ($scope, newfeedService, $window, headerService,postService) {
                        $scope.iconLike = false;
                        $scope.iconFavorite = false;

                        postService.getPost(id)
                            .success(function (data) {
                                $scope.post = data.post;
                                $scope.post.created_at = beautyDate.prettyDate($scope.post.created_at);
                                for (var i=0;i<$scope.post.tag_picture.length;i++){
                                    $scope.post.tag_picture[i].price = accounting.formatNumber($scope.post.tag_picture[i].price);
                                }
                                for (var i=0;i<$scope.post.comments.length;i++){
                                    $scope.post.comments[i].created_at = beautyDate.prettyDate($scope.post.comments[i].created_at);
                                }
                                console.log($scope.post);
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

                                        postService.likeOrDislike(data)
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

                                $scope.closeDialog = function () {
                                    ngDialog.close();
                                }
                            })
                            .error(function (data) {

                            });
                    }]
                });
            }
        }
    }
})(angular);
