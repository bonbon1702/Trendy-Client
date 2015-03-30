/**
 * Created by tuan on 12/16/2014.
 */

var app = angular.module('magiccard', []);

app.directive('magiccard', function () {
        return {
            restrict: 'E',
            scope: {
                callback: '=callback',
                data: '=data',
                src: '@src',
                update: '=update'
            },
            link: link,
            controller: controller,
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl;
            }
        };
        function link(scope, element, attrs) {
            angular.element(element[0]).on('click', function (e) {
                if (scope.onTyping == false) {
                    var position = scope.findPos(e, element[0]);
                    var positionDialog = {
                        top: position.PosY,
                        left: position.PosX,
                        imgTop: position.ImgPosY,
                        imgLeft: position.ImgPosX
                    };
                    scope.setPos(positionDialog.imgTop, positionDialog.imgLeft, positionDialog.imgTop, positionDialog.imgLeft);
                }
            });

            angular.element(document).find("button#tagButton").bind('click', function () {
                scope.tagSwitch();
            });

            scope.submit = function () {
                var data = {
                    top: scope.imgTop,
                    left: scope.imgLeft,
                    info: scope.formData
                };
                if (scope.callback) {
                    scope.callback(data);
                }
                scope.show = false;
                scope.completing = false;
            }
        }

        function controller($scope, $http) {
            $scope.completing = false;
            $scope.onTyping = false;
            $scope.onTag = false;
            $scope.top = null;
            $scope.left = null;
            $scope.show = false;
            $scope.formData = {};
            $scope.cursor = "auto";
            $scope.imgTop = null;
            $scope.imgLeft = null;

            $scope.tagSwitch = function () {
                if ($scope.onTag == false) {
                    $scope.onTag = true;
                    $scope.cursor = "move";
                    $scope.show = false;
                    $scope.completing = false;
                } else {
                    $scope.onTag = false;
                    $scope.cursor = "auto";
                }
                $scope.$apply();
            };

            this.findPosImg = function (oElement) {
                if (typeof( oElement.offsetParent ) != "undefined") {
                    for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                        posX += oElement.offsetLeft;
                        posY += oElement.offsetTop;
                    }
                    return [posX, posY];
                }
                else {
                    return [oElement.x, oElement.y];
                }
            };
            $scope.findPosImg = this.findPosImg;

            this.findPos = function (e, ele) {
                var PosX = 0;
                var PosY = 0;
                var position;
                var ImgPos = $scope.findPosImg(ele.querySelector('.has-magiccard img'));
                if (e.pageX || e.pageY) {
                    PosX = e.pageX;
                    PosY = e.pageY;
                }
                else if (e.clientX || e.clientY) {
                    PosX = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft;
                    PosY = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
                }
                console.log(ImgPos[1]);
                position = {
                    PosX: PosX,
                    PosY: PosY,
                    ImgPosX: PosX - ImgPos[0],
                    ImgPosY: PosY - 120
                };
                return position;
            };

            $scope.findPos = this.findPos;

            $scope.setPos = function (top, left, imgTop, imgLeft) {
                $scope.top = top;
                $scope.left = left;
                $scope.imgTop = imgTop;
                $scope.imgLeft = imgLeft;

                $scope.show = true;
                $scope.formData = "";
                if ($scope.completing == true) {
                    $scope.completing = false;
                } else {
                    $scope.completing = true;
                }
                $scope.$apply();
            };
        }
    }
);

app.directive('eatClick', function () {
    return function (scope, element, attrs) {
        $(element).click(function (event) {
            event.preventDefault();
        });
    }
});

app.directive('hovercard', function () {
    return {
        restrict: 'E',
        scope: {
            src: '@src',
            callback: '=callback',
            data: '=data'
        },
        link: link,
        controller: controller,
        template: '<div class="has-magiccard">\
            <img alt="Photo" class="img-responsive" ng-src="{{ src }}">\
        <div ng-repeat="point in points">\
            <div class="magiccard" style="top: {{ point.top - 50 }}px; left: {{ point.left - 25 }}px">\
                <span class="item-tag-1" style="margin-left: 0px">\
                    <span class="item-tag-label">\
                                {{ $index +1 }}\
                    </span>\
                </span>\
        </div></div>'
    };
    function link(scope, element, attrs) {
        scope.$watch('data', function () {
            if (scope.data) {
                var img = angular.element(document.querySelector('.has-magiccard')).find('img');
                var margin_left = parseInt(img.css('margin-left').substring(0,img.css('margin-left').length -2 ));

                for (var i = 0; i < scope.data.length; i++) {
                    var point = {
                        top: parseInt(scope.data[i].top) + 50,
                        left: parseInt(scope.data[i].left) + margin_left
                    };
                    scope.points.push(point);
                }
            }
        });
    }

    function controller($scope, $http) {
        $scope.points = [];


    }
});

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);