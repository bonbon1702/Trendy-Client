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
        }
        function link(scope, element, attrs) {
            angular.element(element[0]).on('click', function (e) {
                if (scope.onTyping == false) {
                    var position = scope.findPos(e, element[0]);
                    var positionDialog = {
                        top: position.PosY - 20,
                        left: position.PosX - 40,
                        imgTop: position.ImgPosY,
                        imgLeft: position.ImgPosX
                    }
                    scope.setPos(positionDialog.top, positionDialog.left, positionDialog.imgTop, positionDialog.imgLeft);
                }
            });

            angular.element(document).find("button#tagButton").bind('click', function () {
                scope.tagSwitch();
            });

            scope.submit = function (top, left) {
                var data = {
                    top: top,
                    left: left,
                    info: scope.formData
                }
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
            }
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
                //PosX = PosX - ImgPos[0];
                //PosY = PosY - ImgPos[1];
                position = {
                    PosX: PosX,
                    PosY: PosY,
                    ImgPosX: PosX - ImgPos[0],
                    ImgPosY: PosY - ImgPos[1]
                };
                return position;
            }

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
            }
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
            src: '=src',
            callback: '=callback',
            data: '=data'
        },
        link: link,
        controller: controller,
        template: '<div class="has-magiccard">\
            <img alt="Photo" style="width: 100%" src="{{ src }}">\
        <div ng-repeat="point in points">\
            <div class="magiccard" style="top: {{ point.top }}px; left: {{ point.left }}px"\
            ng-mouseenter="show=true"\
            ng-mouseleave="show=fale">\
                <span class="item-tag">\
                    <span class="item-tag-label">\
                                <i class="mpcth-price">{{ point.price }}</i>\
                    </span>\
                </span>\
                <div class="magiccard-content bigEntrance" ng-show="show">\
                    <h3>{{point.name}}</h3>\
                </div>\
        </div></div>'
    }
    function link(scope, element, attrs) {

    }

    function controller($scope, $http) {
        $scope.show = false;
        $scope.points = [];

        for (var i = 0; i < $scope.data.length; i++) {
            var point = {
                name: $scope.data[i].name,
                price: accounting.formatNumber($scope.data[i].price),
                top: parseInt($scope.data[i].top) + 31,
                left: parseInt($scope.data[i].left)
            }
            $scope.points.push(point);
        }
    }
});