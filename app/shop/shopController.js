/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('shopController', shopController);

    shopController.$inject = ['$scope', 'ngDialog', 'shopService'];

    function shopController($scope, ngDialog, shopService, headerService) {
        googleMap.init();
        $scope.comment = null;

        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
            })
            .error();

        $scope.showDialog = function (id) {
            ngDialog.open({
                template: 'app/shop/templates/shop.html',
                controller: ['$scope', 'shopService', 'window', 'headerService', function ($scope, shopService, $window, headerService) {
                    $scope.iconLike = false;

                    shopService.get(id)
                        .success(function(data){
                            $scope.shop = data.shop;

                            headerService.loginUser()
                                .success(function(data){
                                    $scope.loginUser = data.user;
                                    if ($scope.loginUser) {
                                        for(var i = 0; i < $scope.shop.like.length; i++) {
                                            if ($scope.shop.like[i].user_id == $scope.loginUser.id) {
                                                $scope.iconLike = true;
                                                break;
                                            } else {
                                                $scope.iconLike = false;
                                            }
                                        }
                                    }
                                })
                                .error();

                            $scope.submitComment = function () {
                                if(!$scope.loginUser) {
                                    event.preventDefault();
                                    headerService.openLogin();
                                } else {
                                    var data = {
                                        'content': $scope.comment,
                                        'type_comment': 1,
                                        'type_id': id,
                                        'user_id': $scope.loginUser.id
                                    };
                                    $scope.comment = null;
                                    shopService.save(data)
                                        .success(function(data){
                                            $scope.shop.comment.push(data.comment);
                                        })
                                        .error(function(data){

                                        });
                                }
                            };

                            $scope.likeOrDislike = function() {
                                if(!$scope.loginUser) {
                                    event.preventDefault();
                                    headerService.openLogin();
                                } else {
                                    var data = {
                                        'id': id,
                                        type: $scope.iconLike == true ? 0 : 1,
                                        user: $scope.loginUser.id
                                    };

                                    shopService.likeOrDislike(data)
                                        .success(function (data) {
                                            if ($scope.iconLike == true) {
                                                $scope.shop.like.length--;
                                                $scope.iconLike = false;
                                            } else {
                                                $scope.shop.like.length++;
                                                $scope.iconLike = true;
                                            }
                                        })
                                        .error(function(data){

                                        });
                                }
                            };

                            $scope.closeDialog = function(){
                                ngDialog.close();
                            }
                        })
                        .error(function(data){

                        });
                }]
            })
        }
    }
})(angular);
