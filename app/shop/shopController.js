/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('shopController', shopController);

    shopController.$inject = ['$scope', 'ngDialog', '$routeParams', 'shopService', 'headerService'];

    function shopController($scope, ngDialog, $routeParams, shopService, headerService) {
        googleMap.init();
        $scope.comment = null;
        $scope.pagingShop = [];
        $scope.countShop = [];
        $scope.offSet = 0;
        $scope.disableLblFrom = true;
        $scope.disableLblTo = false;
        $scope.from = 1;
        $scope.to = 12;
        $scope.infoOpen=false;
        $scope.serviceOpen = false;
        $scope.contactOpen =  false;
        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
            })
            .error();

        shopService.get($routeParams.shopId)
            .success(function (data) {
                $scope.shop = data.shop;
                for (var i = 0; i < data.shop.posts.length; i++) {
                    if (i < 12) {
                        $scope.pagingShop.push(data.shop.posts[i]);
                    }
                    $scope.countShop.push(data.shop.posts[i]);
                }
                for (var i = 0; i < $scope.shop.like.length; i++) {
                    if ($scope.loginUser.id == $scope.shop.like[i].user_id) {
                        $scope.likeBtnStatus = "Liked";
                    } else
                        $scope.likeBtnStatus = "Like";
                }
                $scope.likeOrDislike = function () {
                    if (!$scope.loginUser) {
                        event.preventDefault();
                        headerService.openLogin();
                    } else {
                        var data = {
                            id: $routeParams.shopId,
                            type: $scope.likeBtnStatus == "Like" ? 1 : 0,
                            user: $scope.loginUser.id
                        };

                        if ($scope.likeBtnStatus == "Like") {
                            $scope.shop.like.length++;
                            $scope.likeBtnStatus = "Liked";
                        } else {
                            $scope.shop.like.length--;
                            $scope.likeBtnStatus = "Like";
                        }

                        shopService.likeOrDislike(data)
                            .success(function (data) {


                            })
                            .error(function (data) {

                            });
                    }
                };
            })
            .error(function (data) {
                console.log(data);
            });

        $scope.submitComment = function () {
            if (!$scope.loginUser) {
                event.preventDefault();
                headerService.openLogin();
            } else {
                var data = {
                    'content': $scope.comment,
                    'type_comment': 1,
                    'type_id': $routeParams.shopId,
                    'user_id': $scope.loginUser.id
                };
                $scope.comment = null;
                $scope.shop.comments.push({
                    'content': data.content,
                    'created_at': 'Just now',
                    'user': {
                        'username': $scope.loginUser.username,
                        'id': $scope.loginUser.id,
                        'picture_profile': $scope.loginUser.picture_profile
                    }
                });
                shopService.save(data)
                    .success(function (data) {
                    })
                    .error(function (data) {

                    });
            }
        };

        $scope.getShop = function (offSet) {
            var data = {
                'shopId': $routeParams.shopId,
                'offSet': offSet
            };
            shopService.getShop(data)
                .success(function (data) {
                    $scope.pagingShop = [];
                    if($scope.offSet<offSet){
                        $scope.from=$scope.from+11;
                        $scope.to=$scope.to+11;

                    }
                    if($scope.offSet>offSet){
                        $scope.from=$scope.from-11;
                        $scope.to=$scope.to-11;
                    }

                    $scope.disableLblTo=false;

                    $scope.offSet=offSet;
                    if ($scope.to > $scope.countShop.length) {
                        $scope.to = $scope.countShop.length;
                        $scope.disableLblTo=true;
                    }

                    $scope.disableLblFrom = false;
                    if ($scope.offSet < 12) {
                        $scope.disableLblFrom = true;
                        $scope.from = 1;
                        $scope.to =12;
                        $scope.disableLblTo=false;
                    } else {
                        $scope.from = offSet;
                    }
                    for (var i = 0; i < data.shops.length; i++) {
                        $scope.pagingShop.push(data.shops[i]);
                    }
                })
                .error(function () {
                    console.log(data);
                });
        }

        $scope.infoShop =function(){
            ngDialog.open({
                template: 'app/shop/templates/inforshop.html',
                className: 'ngdialog-theme-plain-custom-editAlbum',
                controller: ['$scope', function ($scope) {
                    $scope.infoShopToggle = function(){
                        $scope.infoOpen= true;
                        $scope.serviceOpen = false;
                        $scope.contactOpen =  false;
                    }
                    $scope.serviceShopToggle = function() {
                        $scope.infoOpen= false;
                        $scope.serviceOpen = true;
                        $scope.contactOpen =  false;
                    }
                    $scope.contactShopToggle = function () {
                        $scope.infoOpen= false;
                        $scope.serviceOpen = false;
                        $scope.contactOpen =  true;
                    }
                }]
            });

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
