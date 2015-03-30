/**
 * Created by nghia on 29/03/2015.
 */
var app = angular.module('imageFill', []);

app.directive('imageFill', function () {
    return {
        restrict: 'A',
        link: link
    };

    function link(scope, element, attrs) {
        angular.element(element).imagefill(scope.$eval(attrs.imageFill));
    }
});