/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('trendyController', trendyController);

    trendyController.$inject = ['$scope', 'ngDialog', 'trendyService', 'headerService', 'userService', 'postService', '$location'];

    function trendyController($scope, ngDialog, trendyService, headerService, userService, postService, $location) {
        $scope.busy = false;
        $scope.posts = [];
        $scope.postsTop3 = [];
        $scope.tagContents = [];
        $scope.postsAll = [];

        $location.path("/");
        $location.search('');

        trendyService.getAllTagContent()
            .success(function(data){
                $scope.tagContents = data.tagContent;
            })
            .error();

        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
            })
            .error();

        $scope.openPost = function(id){
            postService.openPost(id, '');
        };

        angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 5000);

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
                    for (var i=0; i< $scope.postsTop3.length; i++){
                        if ($scope.postsTop3[i].id == id){
                            $scope.postsTop3[i].like.length--;
                            $scope.postsTop3[i].isLike = false;
                        }
                    }

                    for (var i=0; i< $scope.posts.length; i++){
                        if ($scope.posts[i].id == id){
                            $scope.posts[i].like.length--;
                            $scope.posts[i].isLike = false;
                        }
                    }
                } else {
                    for (var i=0; i< $scope.postsTop3.length; i++){
                        if ($scope.postsTop3[i].id == id){
                            $scope.postsTop3[i].like.length++;
                            $scope.postsTop3[i].isLike = true;
                        }
                    }

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
                    for (var i = 0; i < $scope.postsTop3.length; i++) {
                        if ($scope.postsTop3[i].id == id) {
                            $scope.postsTop3[i].favorite.length--;
                            $scope.postsTop3[i].isFavorite = false;
                        }
                    }

                    for (var i = 0; i < $scope.posts.length; i++) {
                        if ($scope.posts[i].id == id) {
                            $scope.posts[i].favorite.length--;
                            $scope.posts[i].isFavorite = false;
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.postsTop3.length; i++) {
                        if ($scope.postsTop3[i].id == id) {
                            $scope.postsTop3[i].favorite.length++;
                            $scope.postsTop3[i].isFavorite = true;
                        }
                    }

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

        $scope.nextPage = function(){
            if ($scope.posts) {

                    var data = {
                        'id': $scope.posts.length + $scope.postsTop3.length,
                        tag : 'all'
                    };

                if ($scope.busy) return;
                $scope.busy = true;

                trendyService.getPostTrendy(data)
                    .success(function (data) {
                        headerService.loginUser()
                            .success(function (r) {
                                if (r.user){
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

                            for (var i =0; i < data.posts.length; i++){
                                $scope.postsAll.push(data.posts[i]);
                            }

                            if($scope.postsTop3.length == 3){
                                for (var j =0; j < data.posts.length; j++){
                                    $scope.posts.push(data.posts[j]);
                                }
                            } else {
                                for (var i =0; i < 3; i++){
                                    $scope.postsTop3.push(data.posts[i]);
                                }
                                for (var j =3; j < data.posts.length; j++){
                                    $scope.posts.push(data.posts[j]);
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
            }
        };
    }
})(angular);

