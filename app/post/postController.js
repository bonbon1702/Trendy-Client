/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('postController', postController);

    postController.$inject = ['$scope', 'postService', '$location', '$routeParams'];

    function postController($scope, postService, $location, $routeParam) {
        $scope.points = [];
        $scope.caption = null;
        $scope.album = null;

        var data = {
            'image': $location.search().image,
            'name': $location.search().title
        };
        postService.upload(data)
            .success(function (data) {
                postService.get(data.upload.name)
                    .success(function (data) {
                        $scope.image = data.upload;
                    })
                    .error(function (data) {

                    });
            })
            .error(function (data) {
                console.log(data);
            });

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
        $scope.deletepoint = function (no) {
            $scope.points.splice(no, 1);
            var number = no + 1;
            angular.element(document).find('.magiccard').each(function () {
                var id = $(this).attr('id');
                if (id > number) {
                    $(this).find('.item-tag-label').text($(this).find('.item-tag-label').text() - 1);
                    $(this).attr('id', id - 1);
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
