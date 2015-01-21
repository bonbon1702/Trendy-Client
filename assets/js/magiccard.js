/**
 * Created by tuan on 12/16/2014.
 */

var app = angular.module('magiccard', []);

app.directive('magiccard', function () {
        function link(scope, element, attrs) {
            if (element.attr('method') == 'click') {
                angular.element(element[0].querySelector('.has-magiccard')).bind('click', function (e) {
                    if (scope.completing == false && scope.onTyping == false) {
                        var magiccard = angular.element(element[0].querySelector('.has-magiccard')).find('.magiccard .magiccard-content');
                        magiccard.hide();
                        scope.completing = true;
                        return;
                    } else if (scope.onTyping == false && scope.onTag == true) {
                        var position = scope.findPos(e, element[0]);
                        var positionDialog = {
                            top: position.PosY + 50,
                            left: position.PosX - 40
                        }

                        var dialog = angular.element(
                            '<div class="magiccard">'
                            + '<form>'
                            + '<input id="top" type="hidden" value="' + positionDialog.top + '">'
                            + '<input id="left" type="hidden" value="' + positionDialog.left + '">'
                            + scope.templ
                            + '</form>'
                            + '</div>');
                        angular.element(element[0].querySelector('.has-magiccard')).append(dialog.css(positionDialog));

                        angular.element(dialog).find("form").submit(function () {
                            var top = angular.element(this).find('input#top').val();
                            var left = angular.element(this).find('input#left').val();
                            var info = [top, left];
                            angular.element(element[0]).find("form :input:visible").each(function () {
                                var input = $(this).val();
                                info.push(input)
                            });
                            if (scope.callback) {
                                scope.callback(info);
                            }
                            angular.element(this).find('div.magiccard-content').hide();
                            scope.completing = false;
                            return false;
                        });
                        scope.completing = false;
                    }

                    angular.element(element[0]).find('.xclose').bind('click', function (event) {
                        event.stopPropagation();
                        var box = angular.element(this).parent().parent();
                        box.remove();
                        scope.completing = true;
                        scope.onTyping = false;
                    });

                    angular.element(element[0]).find(".magiccard .item-tag").mouseenter(function () {
                        var magiccard = angular.element(element[0].querySelector('.has-magiccard')).find('.magiccard .magiccard-content');
                        magiccard.hide();
                        angular.element(this).next().show();
                        scope.completing = false;
                    });

                    angular.element(element[0]).find(".magiccard")
                        .mouseenter(function () {
                            scope.onTyping = true;
                        })
                        .mouseleave(function () {
                            scope.onTyping = false;
                        });

                });
            } else if (element.attr('method') == 'hover') {
                if (scope.data) {
                    var points = scope.data;
                    for (var i = 0; i < points.length; i++) {
                        var position = {
                            top: parseInt(points[i].top) +31,
                            left: parseInt(points[i].left)
                        };
                        var point = angular.element(
                            '<div class="magiccard">'
                            + '<span class="item-tag">\
                            <span class="item-tag-label">\
                                <i class="mpcth-price">'+ accounting.formatNumber(points[i].price) +'</i>\
                            </span></span>'
                            + '<div class="magiccard-content bigEntrance" style="display: none">'
                            + '<h3>' + points[i].name + '</h3>'
                            + '</div>'
                            + '</div>');
                        angular.element(element[0].querySelector('.has-magiccard')).append(point.css(position));

                    }
                    angular.element(element[0]).find(".magiccard .item-tag").mouseenter(function () {
                        var magiccard = angular.element(element[0].querySelector('.has-magiccard')).find('.magiccard .magiccard-content');
                        magiccard.hide();
                        angular.element(this).next().show();
                    });
                    angular.element(element[0]).find(".magiccard").mouseleave(function () {
                        var magiccard = angular.element(element[0].querySelector('.has-magiccard')).find('.magiccard .magiccard-content');
                        magiccard.hide();
                    });
                }

            }

            angular.element(document).find("button#tagButton").bind('click',function(){
                scope.tagSwitch();
            });

        }

        function controller($scope, $http) {
            $scope.completing = true;
            $scope.onTyping = false;
            $scope.onTag = false;
            $scope.tagSwitch = function() {
                if ($scope.onTag == false){
                    $scope.onTag = true;
                } else {
                    $scope.onTag = false;
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
                PosX = PosX - ImgPos[0];
                PosY = PosY - ImgPos[1];
                position = {
                    PosX: PosX,
                    PosY: PosY
                };

                return position;
            }

            $scope.findPos = this.findPos;

            $http.get($scope.templateBox).then(function (template) {
                $scope.templ = template.data;
            });

        }

        return {
            restrict: 'E',
            scope: {
                templateBox: '=templateBox',
                src: '=src',
                callback: '=callback',
                data: '=data'
            },
            link: link,
            controller: controller,
            template: '<div class="has-magiccard">' +
            '<img alt="Photo" style="width: 100%;cursor:move" src="{{ src }}">' +
            '</div>'
        }
    }
);

app.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    }
})