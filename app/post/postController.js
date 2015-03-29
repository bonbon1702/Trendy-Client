/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('postController', postController);

    postController.$inject = ['$scope', 'postService', '$location', '$routeParams', 'headerService', '$window'];

    function postController($scope, postService, $location, $routeParam, headerService, $window) {
        $scope.points = [];
        $scope.caption = null;
        $scope.album = null;
        $scope.tagContent = [];
        $scope.tags = [];


        headerService.loginUser()
            .success(function (data) {
                $scope.user = data.user;
            })
            .error(function (data) {

            });

        postService.loadTag()
            .success(function(data){
                $scope.tagContent = data.tagContent;
            });

        $scope.addTag = function(id, content){
            $scope.tags.push({
                'id': id,
                'content': content
            });
        };

        $scope.deleteTag = function(id){
            for (var i = 0; i< $scope.tags.length;i++){
                if ($scope.tags[i].id == id) $scope.tags.splice(i, 1);
            }
        };

        $scope.image = {
            'image': $location.search().image,
            'name': $location.search().title,
            'editor': $location.search().editor
        };

        $scope.callback = function (point) {
            var number = $scope.points.length + 1;
            var po = {
                no: number,
                top: point.top,
                left: point.left,
                name: point.info.name,
                price: accounting.formatNumber(point.info.price),
                address: point.info.yourchoice
            };
            $scope.points.push(po);
            var point = angular.element(
                '<div class="magiccard" id="' + number + '">' +
                '<div class="item-tag-1">' +
                '<span class="item-tag-label">' + number + '</span>' +
                '</div></div>');
            var position = {
                top: po.top - 30,
                left: po.left - 45
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
            if (type.length > 1) {
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
            var data;
            if ($scope.image.editor != 'false') {
                data = {
                    caption: $scope.caption,
                    points: $scope.points,
                    name: $scope.image.name,
                    album: $scope.album != null ? $scope.album : "Untitled Album",
                    url: $scope.image.image,
                    tags: $scope.tags,
                    user_id: $scope.user.id
                };
            } else {
                data = {
                    caption: $scope.caption,
                    points: $scope.points,
                    name: $scope.image.name,
                    album: $scope.album != null ? $scope.album : "Untitled Album",
                    url: null,
                    tags: $scope.tags,
                    user_id: $scope.user.id
                };
            }
            postService.save(data)
                .success(function (data) {
                    $location.path("/");
                })
                .error(function (data) {
                    console.log(data);
                });
        }

    }
})(angular);
