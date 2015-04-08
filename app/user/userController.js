/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('userController', userController);

    userController.$inject = ['$scope', 'ngDialog', '$base64', '$routeParams', '$route', 'userService', 'headerService', 'postService', 'homeService'];

    function userController($scope, ngDialog, $base64, $routeParams, $route, userService, headerService, postService, homeService) {
        $scope.flwBtnLbl = 'Follow';
        $scope.loginUserId;
        $scope.cover = '';
        $scope.user;
        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.coverFlag = true;
        $scope.itemToItemFollow = [];
        $scope.pageUserId = $routeParams.userId;
        $scope.flwBtnStatus = true;



        userService.getUser($routeParams.userId)
            .success(function (data) {
                $scope.loginUserId = $routeParams.userId;
                $scope.following = [];
                $scope.follower = [];
                $scope.user = data.user;
                $scope.cover = data.user.image_cover;
                flag = false;
                $scope.show = true;
                $scope.flagCoverBtn = false;

                headerService.loginUser()
                    .success(function (r) {
                        if (r.user) {
                            userService.suggestITI({
                                'loginId': r.user.id,
                                'user_id': $routeParams.userId
                            }).success(function(data){

                                $scope.itemToItemFollow = data.suggests;
                            }).error(function(data){

                            });

                            $scope.folowingUser = function(user_id){
                                data = {
                                    user_id: user_id,
                                    follower_id: $scope.loginUserId
                                };
                                userService.addFollow(data)
                                    .success(function () {
                                        userService.suggestITI({
                                            'loginId': r.user.id,
                                            'user_id': $routeParams.userId
                                        }).success(function(k){
                                            $scope.itemToItemFollow = [];
                                            $scope.itemToItemFollow = k.suggests;
                                        }).error(function(data){

                                        });
                                    })
                                    .error(function (data) {
                                        console.log(data);
                                    })
                            };

                            userService.getUser(r.user.id)
                                .success(function (e) {
                                    $scope.loginUser = e.user;
                                    if (data.user.follower.length > 0) {
                                        for (var i = 0; i < data.user.follower.length; i += 1) {
                                            $scope.follower.push(data.user.follower[i]);
                                            for (var k = 0; k < $scope.loginUser.follower.length; k++) {
                                                if (data.user.follower[i] != null) {
                                                    if ($scope.loginUser.id == data.user.follower[i].follower_id) {
                                                        $scope.follower[i].status = 'none';
                                                    } else if (data.user.follower[i].follower_id == $scope.loginUser.follower[k].follower_id) {
                                                        $scope.follower[i].status = 'Following';
                                                        break;
                                                    } else {
                                                        $scope.follower[i].status = 'Follow';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (data.user.following.length > 0) {
                                        for (var j = 0; j < data.user.following.length; j += 1) {
                                            $scope.following.push(data.user.following[j]);
                                            if ($scope.loginUser.following.length > 0) {
                                                for (var k = 0; k < $scope.loginUser.following.length; k++) {
                                                    if (data.user.following[j] != null) {
                                                        if ($scope.loginUser.id == data.user.following[j].user_id) {
                                                            $scope.following[j].status = 'none';
                                                        } else if (data.user.following[j].user_id == $scope.loginUser.following[k].user_id) {
                                                            $scope.following[j].status = 'Following';
                                                            break;
                                                        } else {
                                                            $scope.following[j].status = 'Follow';
                                                        }
                                                    }
                                                }
                                            } else {
                                                $scope.following[j].status = 'Follow';
                                            }
                                        }
                                    }
                                })
                                .error();
                        } else {
                            if (data.user.follower.length > 0) {
                                for (var i = 0; i < data.user.follower.length; i += 1) {
                                    $scope.follower.push(data.user.follower[i]);
                                    if (data.user.follower[i] != null) {
                                        $scope.follower[i].status = 'none';
                                    }
                                }
                            }
                            if (data.user.following.length > 0) {
                                for (var j = 0; j < data.user.following.length; j += 1) {
                                    $scope.following.push(data.user.following[j]);
                                    if (data.user.following[j] != null) {
                                        $scope.following[j].status = 'none';
                                    }
                                }
                            }
                        }
                    })
                    .error();
            })
            .error(function (data) {
                console.log(data);

            });

        headerService.loginUser()
            .success(function (data) {
                if (data.user != null) {
                    $scope.flwBtnStatus = false;
                    $scope.loginUserId = data.user.id;
                    headerService.getUser($scope.loginUserId)
                        .success(function (data) {
                            if ($scope.loginUserId == $routeParams.userId) {
                                $scope.flwBtnStatus = true;
                            }
                            for (var j = 0; j < data.user.following.length; j += 1) {
                                if (data.user.following[j].user_id == $routeParams.userId || $scope.loginUserId == $routeParams.userId) {
                                    $scope.flwBtnStatus = true;
                                }
                            }
                        })
                        .error(function (data) {
                            console.log(data);

                        });
                }
            })
            .error(function (data) {
                console.log(data);
            });

        $scope.flwBtnClick = function () {
            var data;
            if (!$scope.loginUserId) {
                headerService.openLogin();
                event.stopPropagation();
                event.preventDefault();
            } else {
                if ($scope.flwBtnLbl == 'Follow') {
                    data = {
                        user_id: $routeParams.userId,
                        follower_id: $scope.loginUserId
                    };
                    userService.addFollow(data)
                        .success(function () {
                            $scope.flwBtnLbl = 'Following';
                            $scope.follower.push($scope.user);
                            $scope.user.follower.length++;
                        })
                        .error(function (data) {
                            console.log(data);
                        })
                } else if ($scope.flwBtnLbl == 'Following') {
                    data = {
                        user_id: $scope.loginUserId,
                        follower_id: $routeParams.userId
                    };
                    userService.removeFollow(data)
                        .success(function () {
                            $scope.flwBtnLbl = 'Follow';
                            $scope.follower.splice($scope.user);
                            $scope.user.follower.length--;
                        })
                        .error(function () {
                            console.log(data);
                        })
                }
            }
        };

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
                    follower_id: $scope.loginUser.id
                };
                userService.addFollow(data)
                    .success(function () {
                        user.status = 'Following';
                    })
                    .error(function (data) {
                        console.log(data);
                    })
            } else if (user.status == 'Following') {
                data = {
                    user_id: $scope.loginUser.id,
                    follower_id: user.follower_id
                };

                userService.removeFollow(data)
                    .success(function () {
                        user.status = 'Follow';
                    })
                    .error(function () {
                        console.log(data);
                    })
            }
        };

        $scope.followingBtnClick = function (user) {
            if (user.status == 'Follow') {
                var data = {
                    user_id: user.user_id,
                    follower_id: $scope.loginUser.id
                };
                userService.addFollow(data)
                    .success(function () {
                        user.status = 'Following';
                    })
                    .error(function (data) {
                        console.log(data);
                    })
            } else if (user.status == 'Following') {
                var data = {
                    user_id: $scope.loginUser.id,
                    follower_id: user.user_id
                };

                userService.removeFollow(data)
                    .success(function () {
                        user.status = 'Follow';
                    })
                    .error(function () {
                        console.log(data);
                    })
            }
        };

        $scope.deletePost = function (post) {
            if ($scope.loginUserId == null) {
                headerService.openLogin();
                event.stopPropagation();
                event.preventDefault();
            } else {
                var data = {
                    'id': post.id
                };
                ngDialog.open({
                    template: 'app/post/templates/confirmDeletePost.html',
                    className: 'ngdialog-theme-plain-custom',

                    controller: ['$scope', function ($scope) {
                        $scope.close = function () {
                            ngDialog.close();
                        };
                        $scope.confirm = function () {
                            ngDialog.close();
                            postService.delete(data)
                                .success(function (data) {
                                    window.location.reload(true);
                                })
                                .error(function (data) {
                                    console.log(data);
                                });
                        }
                    }]
                });
            }

        };

        $scope.deletePostInAlbumDetail = function (post) {
            if ($scope.loginUserId == null) {
                headerService.openLogin();
                event.stopPropagation();
                event.preventDefault();
            } else {
                data = {
                    'id': post.post_id
                }
                ngDialog.open({
                    template: 'app/post/templates/confirmDeletePost.html',
                    className: 'ngdialog-theme-plain-custom',
                    controller: ['$scope', function ($scope) {
                        $scope.close = function () {
                            ngDialog.close();
                        };
                        $scope.confirm = function () {
                            ngDialog.close();
                            postService.delete(data)
                                .success(function (data) {
                                    //document.getElementById("tab2-3-1").innerHTML=data;
                                    $route.reload();
                                    localStorage.setItem('lastTab', "#tab2-3-1");
                                    //$scope.$on('$viewContentLoaded', addCrudControls);
                                    //angular.element($('a[data-target=' + localStorage.getItem('lastTab') + ']').tab('show'));
                                })
                                .error(function (data) {
                                    console.log(data);
                                });
                        }
                    }]
                });
            }

        };

        $scope.editAlbum = function (album, userId) {
            ngDialog.open({
                template: 'app/post/templates/editAlbum.html',
                className: 'ngdialog-theme-plain-custom-editAlbum',
                controller: ['$scope', function ($scope) {
                    $scope.albPicture = album.album_detail[0].image_url_editor;
                    $scope.updtAlbName = album.album_name;
                    $scope.deleteAlbum = function () {
                        if (userId == null) {
                            headerService.openLogin();
                            event.stopPropagation();
                            event.preventDefault();
                        } else {
                            data = {
                                'albName': album.album_name
                            };
                            ngDialog.open({
                                template: 'app/post/templates/confirmDeletePost.html',
                                className: 'ngdialog-theme-plain-custom',
                                controller: ['$scope', function ($scope) {
                                    $scope.confirm = function () {
                                        ngDialog.close();
                                        postService.deleteAlbum(data)
                                            .success(function (data) {
                                                ngDialog.close();
                                                $route.reload();
                                            })
                                            .error(function (data) {
                                                console.log(data);
                                            });
                                    };
                                }]
                            });
                        }
                    };

                    $scope.editAlbumName = function () {
                        if (userId == null) {
                            headerService.openLogin();
                            event.stopPropagation();
                            event.preventDefault();
                        } else {
                            data = {
                                'id': album.id,
                                'album_name': $scope.updtAlbName
                            }
                            postService.editAlbumName(data)
                                .success(function (data) {
                                    ngDialog.open({
                                        template: 'app/post/templates/congratulation.html',
                                        className: 'ngdialog-theme-plain-custom-congratulation',
                                        controller: ['$scope', function ($scope) {
                                            $scope.confirm = function () {
                                                ngDialog.close();
                                                $route.reload();
                                            };
                                        }]
                                    });
                                })
                                .error(function (data) {
                                    console.log(data);
                                });
                        }
                    }
                }]
            });

        };

        $scope.openPostUser = function (id) {
            postService.openPost(id, 'user/' + $routeParams.userId);
        };

        $scope.imageSelected = function ($files,evt) {
            headerService.upload($files[0])
                .success(function (data) {
                    $scope.flagCoverBtn = true;
                    $scope.coverFlag = false;
                    $scope.cover = data.upload.image_url;

                    $scope.saveCoverImg = function () {
                        //headerService.upload($scope.myCroppedImage)
                        //    .success(function (data) {
                        var coverImg = {
                            user_id: parseInt($routeParams.userId),
                            image_cover: $scope.myCroppedImage
                        };
                        userService.updateCover(coverImg)
                            .success(function () {
                                $scope.flagCoverBtn = false;
                                $scope.coverFlag = true;
                            })
                            .error(function (coverImg) {
                                console.log(coverImg);
                            });
                        //})
                        //.error()
                    };
                    $scope.cancelCoverImg = function () {
                        $scope.cover = $scope.user.image_cover;
                        $scope.coverFlag = true;
                        $scope.flagCoverBtn = false;
                    }

                })
                .error(function (data) {
                    console.log(data);
                });

        };

    }
})(angular);
