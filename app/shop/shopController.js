/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('shopController', shopController);

    shopController.$inject = ['$scope', 'ngDialog', '$routeParams','$route', 'shopService', 'headerService', 'postService'];

    function shopController($scope, ngDialog, $routeParams,$route, shopService, headerService, postService) {
        $scope.comment = null;
        $scope.pagingShop = [];
        $scope.countShop = [];
        $scope.offSet = 0;
        $scope.disableLblFrom = true;
        $scope.disableLblTo = false;
        $scope.from = 1;
        $scope.to = 12;
        $scope.infoOpen = false;
        $scope.serviceOpen = false;
        $scope.contactOpen = false;
        $scope.suggestShop = [];
        $scope.editingComment = false;


        headerService.loginUser()
            .success(function (data) {
                if (data.user == null) {
                    $scope.likeBtnStatus = "Like";
                } else {
                    $scope.loginUser = data.user;
                    var r = {
                        'loginId': data.user.id,
                        'shopId': $routeParams.shopId
                    };

                    $scope.editComment = function (index, content) {
                        $scope.shop.comments[index].editing = 'yes';
                        $scope.editContent = content;
                    };

                    $scope.submitEditComment = function (index) {
                        $scope.shop.comments[index].content = this.editContent;
                        $scope.shop.comments[index].editing = null;
                        shopService.editShopComment({
                            id: $scope.shop.comments[index].id,
                            content: this.editContent
                        }).success(function (data) {

                        }).error();
                    };

                    $scope.deleteCommentIndex = function (index) {

                        shopService.deleteShopComment({
                            id: $scope.shop.comments[index].id
                        }).success(function (data) {

                        }).error();
                        $scope.shop.comments.splice(index, 1);
                    };

                    $scope.closeEditComment = function (index) {
                        $scope.shop.comments[index].editing = null;
                    };
                    shopService.suggestShop(r)
                        .success(function (k) {
                            $scope.suggestShop = k.suggests;
                        })
                        .error(function (data) {
                        });
                    $scope.likeShop = function (id) {
                        shopService.likeOrDislike({
                            'id': id,
                            'type': 1,
                            'user': data.user.id
                        })
                            .success(function (data) {
                                var r = {
                                    'loginId': $scope.loginUser.id,
                                    'shopId': $routeParams.shopId
                                };
                                shopService.suggestShop(r)
                                    .success(function (k) {
                                        $scope.suggestShop = k.suggests;
                                    })
                                    .error(function (data) {
                                    });
                            })
                            .error(function (data) {

                            });
                    };

                }
            })
            .error();

        shopService.get($routeParams.shopId)
            .success(function (data) {

                shopMap.init(data);
                shopMap.createMarker(data);
                for (var i=0; i < data.shop.comments.length;i++){
                    data.shop.comments[i].created_at = beautyDate.prettyDate(data.shop.comments[i].created_at);
                }

                if (data.shop.shop_detail){
                    data.shop['name'] = data.shop.shop_detail['name'];
                    data.shop['address'] = data.shop.shop_detail['street'] + ', ' + data.shop.shop_detail['district'] + ', ' + data.shop.shop_detail['city'];
                    $scope.shop = data.shop;
                } else{
                    $scope.shop = data.shop;
                }

                for (var i = 0; i < data.shop.posts.length; i++) {
                    if (i < 12) {
                        $scope.pagingShop.push(data.shop.posts[i]);
                    }
                    $scope.countShop.push(data.shop.posts[i]);
                }
                headerService.loginUser()
                    .success(function(r){
                        if($scope.shop.like.length == 0){
                            $scope.likeBtnStatus ="Like";
                        }
                        for (var i = 0; i < $scope.shop.like.length; i++) {
                            if (r.user != null && r.user.id == $scope.shop.like[i].user_id) {
                                $scope.likeBtnStatus = "Liked";
                            } else
                                $scope.likeBtnStatus = "Like";
                        }
                    }).error();


                $scope.likeOrDislike = function () {
                    if (!$scope.loginUser) {
                        $scope.likeBtnStatus = "Like";
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
                    if ($scope.offSet < offSet) {
                        $scope.from = $scope.from + 11;
                        $scope.to = $scope.to + 11;

                    }
                    if ($scope.offSet > offSet) {
                        $scope.from = $scope.from - 11;
                        $scope.to = $scope.to - 11;
                    }

                    $scope.disableLblTo = false;

                    $scope.offSet = offSet;
                    if ($scope.to > $scope.countShop.length) {
                        $scope.to = $scope.countShop.length;
                        $scope.disableLblTo = true;
                    }

                    $scope.disableLblFrom = false;
                    if ($scope.offSet < 12) {
                        $scope.disableLblFrom = true;
                        $scope.from = 1;
                        $scope.to = 12;
                        $scope.disableLblTo = false;
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
        };

        $scope.infoShop = function (shop) {
            ngDialog.open({
                template: 'app/shop/templates/inforshop.html',

                className: 'ngdialog-theme-plain-infoShop',
                controller: ['$scope', function ($scope) {
                    $scope.shop=shop;


                    $scope.infoShopToggle = function () {
                        $scope.infoOpen = true;
                        $scope.serviceOpen = false;
                        $scope.contactOpen = false;
                    };
                    $scope.saveInfoShop = function () {
                        $scope.infoOpen = false;
                    };
                    $scope.serviceShopToggle = function () {
                        $scope.infoOpen = false;
                        $scope.serviceOpen = true;
                        $scope.contactOpen = false;
                    };
                    $scope.saveServiceShop = function () {
                        $scope.serviceOpen = false;
                    };
                    $scope.contactShopToggle = function () {
                        $scope.infoOpen = false;
                        $scope.serviceOpen = false;
                        $scope.contactOpen = true;
                    };
                    $scope.saveContactShop = function () {
                        $scope.contactOpen = false;
                    };
                    if (shop.shop_detail) {
                        //Map
                        $scope.street = shop.shop_detail.street;
                        $scope.district = shop.shop_detail.district;
                        $scope.city = shop.shop_detail.city;
                        $scope.near_place = shop.shop_detail.near_place;
                        $scope.way_direction = shop.shop_detail.way_direction;

                        //Basic Information
                        $scope.shop_name = shop.shop_detail.name;
                        $scope.time_open = shop.shop_detail.time_open;
                        $scope.time_close = shop.shop_detail.time_close;
                        $scope.price_from = shop.shop_detail.price_from;
                        $scope.price_to = shop.shop_detail.price_to;


                        //Service Infomation
                        $scope.morning = shop.shop_detail.midday == 1 ? true : false;
                        $scope.midday = shop.shop_detail.midday == 1 ? true : false;
                        $scope.afternoon = shop.shop_detail.afternoon == 1 ? true : false;
                        $scope.night = shop.shop_detail.night == 1 ? true : false;
                        $scope.shipping = shop.shop_detail.shipping == 1 ? true : false;
                        $scope.credit_card = shop.shop_detail.credit_card == 1 ? true : false;
                        $scope.cooler = shop.shop_detail.cooler == 1 ? true : false;
                        $scope.parking = shop.shop_detail.parking == 1 ? true : false;
                        $scope.children = shop.shop_detail.children == 1 ? true : false;
                        $scope.teen = shop.shop_detail.teen == 1 ? true : false;
                        $scope.middleaged = shop.shop_detail.middleaged == 1 ? true : false;
                        $scope.oldster = shop.shop_detail.oldster == 1 ? true : false;
                        $scope.men = shop.shop_detail.men == 1 ? true : false;
                        $scope.women = shop.shop_detail.women == 1 ? true : false;

                        //Contact information
                        $scope.phone = shop.shop_detail.tel;
                        $scope.website = shop.shop_detail.website;
                        $scope.facebook_page = shop.shop_detail.facebook_page;

                    }
                    $scope.saveShopDetail = function(){
                        data ={
                            'shop_id' : shop.id,
                            'name' : $scope.shop_name,
                            'street' : $scope.street,
                            'district' : $scope.district,
                            'city' : $scope.city,
                            'near_place' : $scope.near_place,
                            'way_direction' : $scope.way_direction,
                            'lat' : shop.shop_detail.lat,
                            'long' : shop.shop_detail.long,
                            'time_open' : $scope.time_open,
                            'time_close' : $scope.time_close,
                            'price_from' : $scope.price_from,
                            'price_to' : $scope.price_to,
                            'morning' : $scope.morning == true ? 1 :0 ,
                            'midday' : $scope.midday== true ? 1 :0 ,
                            'afternoon' : $scope.afternoon== true ? 1 :0 ,
                            'night' : $scope.night== true ? 1 :0 ,
                            'shipping' : $scope.shipping== true ? 1 :0 ,
                            'credit_card' : $scope.credit_card== true ? 1 :0 ,
                            'cooler' : $scope.cooler== true ? 1 :0 ,
                            'parking' : $scope.parking== true ? 1 :0 ,
                            'children' : $scope.children== true ? 1 :0 ,
                            'teen' : $scope.teen== true ? 1 :0 ,
                            'middleaged' : $scope.middleaged== true ? 1 :0 ,
                            'oldster' : $scope.oldster== true ? 1 :0 ,
                            'men' : $scope.men== true ? 1 :0 ,
                            'women' : $scope.women== true ? 1 :0 ,
                            'tel' : $scope.phone,
                            'website' : $scope.website,
                            'facebook_page' : $scope.facebook_page,
                            'approve' : 0
                        };

                        shopService.saveShopDetail(data)
                            .success(function(data){
                                ngDialog.open({
                                    template: 'app/shop/templates/congratulationInfoShop.html',
                                    className: 'ngdialog-theme-plain-custom-congratulation',
                                    controller: ['$scope', function ($scope) {
                                        $scope.confirm = function () {
                                            ngDialog.close();
                                            $route.reload();
                                        };
                                    }]
                                });
                            })
                            .error(function(data){
                                console.log(data);
                            });
                    }
                }]
            });

        };

        $scope.showDialog = function (id) {
            postService.openPost(id, 'shop/'+ $routeParams.shopId);
        };
    }
})(angular);
