/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('postController', postController);

    postController.$inject = ['$scope', 'postService', '$location', '$routeParams', 'headerService'];

    function postController($scope, postService, $location, $routeParam, headerService) {
        $scope.points = [];
        $scope.caption = null;
        $scope.album = null;
        headerService.getUser()
            .success(function(data){
                $scope.user = data.user;
            })
            .error(function(data){

            });
        var data = {
            'image': $location.search().image,
            'name': $location.search().title
        };
        $scope.image = {
            'image_url_editor': 'http://localhost:81/projects/Trendy-Server/public/assets/images/r4vuith1.jpg'
        }  ;
        //postService.upload(data)
        //    .success(function (data) {
        //        postService.get(data.upload.name)
        //            .success(function (data) {
        //                $scope.image = data.upload;
        //            })
        //            .error(function (data) {
        //
        //            });
        //    })
        //    .error(function (data) {
        //        console.log(data);
        //    });

        $scope.callback = function (point) {
            var number = $scope.points.length + 1;
            var po = {
                no: number,
                top: point.top,
                left: point.left,
                name: point.info.name,
                price: point.info.price,
                address: point.info.yourchoice
            };
            $scope.points.push(po);
            var point = angular.element(
                '<div class="magiccard" id="' + number + '">' +
                '<div class="item-tag-1">' +
                '<span class="item-tag-label">' + number + '</span>' +
                '</div></div>');
            var position = {
                top: po.top,
                left: po.left
            };
            angular.element(document).find('.has-magiccard').append(point.css(position));

        };
        $scope.deletePoint = function (no) {
            $scope.points.splice(no, 1);
            var number = no + 1;
            angular.element(document).find('.magiccard').each(function () {
                var id = $(this).id;
                if (id > number) {
                    angular.element($(this)).find('.item-tag-label').text(angular.element($(this)).find('.item-tag-label').text() - 1);
                    angular.element($(this)).attr('id', id - 1);
                }
            });

            angular.element(document).find('.magiccard#' + number).remove();

        };

        $scope.update = function (type) {
            if (type != null) {
                var data = {
                    type: type
                };
                postService.update(data)
                    .success(function (data) {
                        var data_shop = data.data;
                        $scope.shop = [];
                        for (var i = 0; i < data_shop.length; i++) {
                            var shop = {
                                name: data_shop[i].name,
                                address: data_shop[i].address
                            };
                            $scope.shop.push(shop);
                        }
                    })
                    .error(function (data) {
                        console.log(data);
                    });
            }
        };
        $scope.submit = function () {
            var data = {
                caption: $scope.caption,
                points: $scope.points,
                name: $scope.image.name,
                album: $scope.album
            };
            postService.save(data)
                .success(function (data) {
                    $location.path('/');
                })
                .error(function (data) {
                    console.log(data);
                });
        }

    }
})(angular);
