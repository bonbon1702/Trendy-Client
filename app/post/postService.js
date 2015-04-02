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
                    url: $rootScope.url + 'post/createPost',
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
            editPostCaption: function(data){
                return $http.get($rootScope.url + 'post/editPostCaption/id/' + data.id + '/caption/' + data.caption);
            },
            editPostComment: function(data){
                return $http.get($rootScope.url + 'comment/editPostComment/id/' + data.id + '/content/' + data.content)
            },
            deletePostComment: function(data){
                return $http.get($rootScope.url + 'comment/deletePostComment/id/' + data.id)
            },
            openPost: function(id){
                ngDialog.open({
                    template: 'app/post/templates/postDetail.html',
                    className: 'ngdialog-theme-plain post-dialog',
                    controller: ['$scope', 'newfeedService', '$window', 'headerService','postService','ngAudio', function ($scope, newfeedService, $window, headerService,postService,ngAudio) {
                        $scope.iconLike = false;
                        $scope.iconFavorite = false;
                        $scope.editing = false;
                        $scope.editingComment = false;


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
                                $scope.editCaption = $scope.post.caption;

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

                                $scope.editComment = function(index, content){
                                    $scope.post.comments[index].editing = 'yes';
                                    $scope.editContent = content;
                                };

                                $scope.submitEditComment = function(index){
                                    $scope.post.comments[index].content = this.editContent;
                                    $scope.post.comments[index].editing = null;
                                    postService.editPostComment({
                                        id: $scope.post.comments[index].id,
                                        content: this.editContent
                                    }).success(function(data){

                                    }).error();
                                };

                                $scope.deleteCommentIndex = function(index){

                                    postService.deletePostComment({
                                        id: $scope.post.comments[index].id
                                    }).success(function(data){

                                    }).error();
                                    $scope.post.comments.splice(index,1);
                                };

                                $scope.closeEditComment = function(index){
                                    $scope.post.comments[index].editing = null;
                                };

                                $scope.editPost = function(){
                                    $scope.editing = true;
                                };

                                $scope.submitCaption = function(){
                                    $scope.post.caption = this.editCaption;
                                    $scope.editing = false;

                                    postService.editPostCaption({
                                        id: id,
                                        caption: this.editCaption
                                    }).success(function(data){

                                    }).error(function(data){
                                        console.log(data);
                                    });
                                };

                                $scope.closeEdit = function(){
                                    $scope.editing = false;
                                };

                                $scope.deletePost = function(){
                                    postService.delete({
                                        id: id
                                    }).success(function(data){

                                    }).error();
                                    $window.location.reload();
                                };

                                $scope.closeDialog = function () {
                                    ngDialog.close();
                                };

                                var socket = io.connect('http://127.0.0.1:3000/');

                                socket.on('realTime.comment', function (data) {
                                    //Do something with data
                                    var results = JSON.parse(data);
                                    if (results.type_comment == 0 && results.type_id == id){
                                        results['created_at'] = beautyDate.prettyDate(results['created_at']);
                                        $scope.post.comments.push(results);
                                        $scope.sound = ngAudio.load("../assets/sound/beep.mp3");
                                        $scope.sound.play();
                                    }
                                });
                            })
                            .error(function (data) {

                            });
                    }]
                });
            }
        }
    }
})(angular);
