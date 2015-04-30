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
            upload: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'uploadEditor',
                    data: data
                });
            },
            delete: function (data) {
                return $http({
                    method: 'GET',
                    url: $rootScope.url + 'post/deletePostById/' + data.id
                });
            },
            deleteAlbum: function (data) {
                return $http({
                    method: 'DELETE',
                    url: $rootScope.url + 'album/deleteAlbumByName/' + data.albName
                });
            },
            editAlbumName: function (data) {
                return $http({
                    method: 'PUT',
                    url: $rootScope.url + 'album/editAlbumById/' + data.id,
                    data: {
                        album_name: data['album_name']
                    }
                });
            },
            saveComment: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'comment/saveComment',
                    data: data,
                    ignoreLoadingBar: true
                });
            },
            likeOrDislike: function (data) {
                return $http.get($rootScope.url + 'like/likePost/' + data.id + '/type/' + data.type + '/user/' + data.user);
            },
            favoritePost: function (data) {
                return $http.get($rootScope.url + 'favorite/userId/' + data.user_id + '/postId/' + data.post_id + '/type/' + data.type);
            },
            getPost: function (id) {
                return $http.get($rootScope.url + 'post/getPostById/' + id);
            },
            loadTag: function (query) {
                return $http.get($rootScope.url + 'tagContent/getAllTag');
            },
            editPostCaption: function (data) {
                return $http.get($rootScope.url + 'post/editPostCaption/id/' + data.id + '/caption/' + data.caption);
            },
            editPostComment: function (data) {
                return $http.get($rootScope.url + 'comment/editPostComment/id/' + data.id + '/content/' + data.content)
            },
            deletePostComment: function (data) {
                return $http.get($rootScope.url + 'comment/deletePostComment/id/' + data.id)
            },
            openPost: function (id, currentUrl) {
                ngDialog.open({
                    template: 'app/post/templates/postDetail.html',
                    className: 'ngdialog-theme-plain post-dialog',
                    controller: ['$scope', 'newfeedService', '$window', 'headerService', 'postService', 'ngAudio', '$location', '$rootScope', function ($scope, newfeedService, $window, headerService, postService, ngAudio, $location, $rootScope) {
                        $scope.iconLike = false;
                        $scope.iconFavorite = false;
                        $scope.editing = false;
                        $scope.editingComment = false;

                        $location.path('/post/' + id, false);
                        $rootScope.$on('ngDialog.closing', function (e, $dialog) {
                            $rootScope.$apply(function () {

                                $location.path('/' + currentUrl, false);
                            });

                        });
                        $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                            var image = $dialog.find('.has-magiccard img')[0];
                            image.onload = function () {
                                var s = this.naturalHeight / 500,
                                    newWidth, widthTotal, modelImage;
                                if (this.naturalWidth < 700) {
                                    newWidth = this.naturalWidth / s;
                                    widthTotal = 700 + 327;
                                    modelImage = 700;
                                } else {
                                    newWidth = this.naturalWidth / s;
                                    widthTotal = newWidth + 327;
                                    modelImage = newWidth;
                                }

                                $dialog.find('.ngdialog-content').css('width', widthTotal);

                                $dialog.find('.has-magiccard img').css('width', newWidth);
                                $dialog.find('.ngdialog-content .img-modal .modal-body .row .modal-image').css('width', modelImage - 2);
                                $dialog.find('.ngdialog-content .img-modal .modal-body .row .modal-image').css('padding', 0);
                                $dialog.find('.ngdialog-content .img-modal .modal-body .row .modal-meta').css('width', '327');
                            };


                        });


                        postService.getPost(id)
                            .success(function (data) {

                                $scope.post = data.post;
                                $scope.post.created_at = beautyDate.prettyDate($scope.post.created_at);
                                for (var i = 0; i < $scope.post.tag_picture.length; i++) {
                                    $scope.post.tag_picture[i].price = accounting.formatNumber($scope.post.tag_picture[i].price);
                                }
                                for (var i = 0; i < $scope.post.comments.length; i++) {
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
                                        if (this.comment != null) {
                                            if (this.comment.length > 255) {
                                                ngDialog.open({
                                                    template: 'app/post/templates/alertInpTxtLength.html',
                                                    className: 'ngdialog-theme-plain-custom',

                                                    controller: ['$scope', 'postService', function ($scope, postService) {
                                                    }]
                                                });
                                            } else {
                                                var data = {
                                                    'content': this.comment,
                                                    'type_comment': 0,
                                                    'type_id': id,
                                                    'user_id': $scope.loginUser.id
                                                };
                                                this.comment = null;

                                                postService.saveComment(data)
                                                    .success(function (data) {
                                                    })
                                                    .error(function (data) {

                                                    });
                                            }
                                        }
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

                                $scope.favorite = function () {
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

                                $scope.editComment = function (index, content) {
                                    $scope.post.comments[index].editing = 'yes';
                                    $scope.editContent = content;
                                };

                                $scope.submitEditComment = function (index, editContent) {
                                    if (editContent.length > 255) {
                                        ngDialog.open({
                                            template: 'app/post/templates/alertInpTxtLength.html',
                                            className: 'ngdialog-theme-plain-custom',

                                            controller: ['$scope', 'postService', function ($scope, postService) {
                                            }]
                                        });
                                    } else {
                                        $scope.post.comments[index].content = this.editContent;
                                        $scope.post.comments[index].editing = null;
                                        postService.editPostComment({
                                            id: $scope.post.comments[index].id,
                                            content: this.editContent
                                        }).success(function (data) {

                                        }).error();
                                    }
                                };

                                $scope.deleteCommentIndex = function (index, comments) {
                                    ngDialog.open({
                                        template: 'app/post/templates/deleteCmtConfirm.html',
                                        className: 'ngdialog-theme-plain-custom',

                                        controller: ['$scope', 'postService', function ($scope, postService) {
                                            $scope.close = function () {
                                                ngDialog.close();
                                            };
                                            $scope.confirm = function () {
                                                postService.deletePostComment({
                                                    id: comments[index].id
                                                })
                                                    .success(function (data) {
                                                    })
                                                    .error(function(data){
                                                        console.log(data);
                                                    });
                                                comments.splice(index, 1);
                                            }
                                        }]
                                    });
                                };

                                $scope.closeEditComment = function (index) {
                                    $scope.post.comments[index].editing = null;
                                };

                                $scope.editPost = function (caption) {
                                    $scope.editing = true;
                                    $scope.editCaption = caption;
                                };

                                $scope.submitCaption = function (editCaption) {
                                    if (editCaption.length > 255) {
                                        ngDialog.open({
                                            template: 'app/post/templates/alertInpTxtLength.html',
                                            className: 'ngdialog-theme-plain-custom',

                                            controller: ['$scope', 'postService', function ($scope, postService) {
                                            }]
                                        });
                                    } else {
                                        $scope.post.caption = this.editCaption;
                                        $scope.editing = false;

                                        postService.editPostCaption({
                                            id: id,
                                            caption: this.editCaption
                                        }).success(function (data) {

                                        }).error(function (data) {
                                            console.log(data);
                                        });
                                    }
                                };

                                $scope.closeEdit = function () {
                                    $scope.editing = false;
                                };

                                $scope.deletePostInside = function () {
                                    ngDialog.open({
                                        template: 'app/post/templates/confirmDeletePost.html',
                                        className: 'ngdialog-theme-plain-custom',

                                        controller: ['$scope', 'postService', function ($scope, postService) {
                                            $scope.close = function () {
                                                ngDialog.close();
                                            };
                                            $scope.confirm = function () {
                                                postService.delete({
                                                    id: id
                                                }).success(function (data) {
                                                    $location.path("/");
                                                    ngDialog.close();
                                                }).error();
                                            }
                                        }]
                                    });
                                };

                                $scope.closeDialog = function () {
                                    ngDialog.close();
                                };

                                $scope.displayED = function (index) {
                                    $scope.post.comments[index].statusED = true;
                                };

                                $scope.notDisplayED = function (index) {
                                    $scope.post.comments[index].statusED = false;
                                };

                                var socket = io.connect('http://103.7.40.222:3000/');

                                socket.on('realTime.comment', function (data) {
                                    //Do something with data
                                    var results = JSON.parse(data);
                                    if (results.type_comment == 0 && results.type_id == id) {
                                        results['created_at'] = beautyDate.prettyDate(results['created_at']);
                                        $scope.post.comments.push(results);
                                        //$scope.sound = ngAudio.load("../assets/sound/beep.mp3");
                                        //$scope.sound.play();
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
