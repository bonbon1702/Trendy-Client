/**
 * Created by tuan on 1/1/2015.
 */
var app = angular.module('lazyloading', []);

app.directive('lazyloading', function () {
    return {
        restrict: 'A',
        link: link
    }

    function link(scope, element, attrs) {
        var poll, delay = 250, offset = 0;

        if (document.addEventListener) {
            this.addEventListener('scroll', load, false);
            this.addEventListener('load', load, false);
        } else {
            this.attachEvent('onscroll', load);
            this.attachEvent('onload', load);
        }

        function load() {
            clearTimeout(poll);
            poll = setTimeout(function () {
                render();
            }, delay);
        }

        function render() {
            if (elementInView(element[0])) {
                attrs.$set('src', attrs.lazy);
                element.removeAttr('lazy');
            }
        }

        function elementInView(element) {
            var rect = element.getBoundingClientRect();

            return (
                rect.top >= (0 - offset)
                && rect.left >= 0
                && rect.top <= ((window.innerHeight || document.documentElement.clientHeight) + offset)
            )
        }
    }
});