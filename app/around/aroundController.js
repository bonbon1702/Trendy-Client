/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('aroundController', aroundController);

    aroundController.$inject = ['$scope', 'ngDialog', 'aroundService', 'headerService', 'userService', 'postService'];

    function aroundController($scope, ngDialog, aroundService, headerService, userService, postService) {
        $scope.busy = false;
        $scope.posts = [];

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }



        getLocation();
        function showPosition(position) {
            var lat, lng;
            if (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
            } else {
                lat = 21.0249399;
                lng = 105.8457613;
            }

            var data = {
                'id': 0,
                lat: lat,
                lng: lng
            };

            aroundService.getPostAround(data)
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
                    if (data.posts.length != 0) {
                        for (var i = 0; i < data.posts.length; i++) {
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

            $scope.openPost = function (id) {
                postService.openPost(id, 'around');
            };

            angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

            $scope.nextPage = function () {

                var data = {
                    'id': $scope.posts.length,
                    lat: lat,
                    lng: lng
                };

                if ($scope.busy) return;
                $scope.busy = true;

                aroundService.getPostAround(data)
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
                        if (data.posts.length != 0) {
                            for (var i = 0; i < data.posts.length; i++) {
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

            };

        }


        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
                aroundService.getAllShop()
                    .success(function(r){
                        if ($scope.loginUser) {
                            var data = {
                                'user_avatar': $scope.loginUser.picture_profile
                            };

                            googleMap.init(data, r.data);
                        } else {
                            var data = {
                                'user_avatar': 'https://cdn4.iconfinder.com/data/icons/ironman_lin/512/ironman_III.png'
                            };
                            googleMap.init(data, r.data);
                        }
                    })
                    .error();
            })
            .error();

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
})(angular);

