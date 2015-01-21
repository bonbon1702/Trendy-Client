/**
 * Created by tuan on 12/13/2014.
 */

var app = angular.module('magicsearch', []);

app.directive('magicsearch', function () {
    var index = -1;
    function controller($scope) {
        $scope.selectedIndex = -1;
        $scope.initLock = true;

        var watching = true;

        $scope.completing = false;

        $scope.getIndex = function(){
            return $scope.selectedIndex;
        }

        $scope.setIndex = function(i){
            $scope.selectedIndex = parseInt(i);
        };

        this.setIndex = function(i){
            $scope.setIndex(i);
            $scope.$apply();
        };

        $scope.$watch('searchParam', function(newValue, oldValue){
            if (oldValue === newValue || (!oldValue && $scope.initLock)) {
                return;
            }

            if (watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null){
                $scope.completing = true;
                $scope.searchFilter = $scope.searchParam;
                $scope.selectedIndex = -1;
            }
            if ($scope.onType){
                $scope.onType($scope.searchParam);
            }
        });

        this.preSelect = function(suggestion){
            watching = false;

            $scope.$apply();
            watching = true;

        };

        $scope.preSelect = this.preSelect;

        this.preSelectOff = function(){
            watching = true;
        };

        $scope.preSelectOff = this.preSelectOff;

        $scope.select = function(suggestion){
            if (suggestion){
                $scope.searchParam = suggestion;
                $scope.searchFilter = suggestion;

                if ($scope.onType){
                    $scope.onType($scope.searchParam)
                }
            }
            watching = false;
            $scope.completing = false;
            $scope.searchParam = null;
            setTimeout(function(){watching = true;},1000);
            $scope.setIndex(-1);
        }
    }

    function link(scope, element, attrs) {
        setTimeout(function() {
            scope.initLock = false;
            scope.$apply();
        }, 250);

        var attr = '';

        scope.attrs = {
            "placeholder": "start typing...",
            "class": "",
            "id": "",
            "inputclass": "",
            "inputid": ""
        };

        for (var a in attrs) {
            attr = a.replace('attr', '').toLowerCase();
            // add attribute overriding defaults
            // and preventing duplication
            if (a.indexOf('attr') === 0) {
                scope.attrs[attr] = attrs[a];
            }
        }

        element[0].onclick = function(e){
            if(!scope.searchParam){
                setTimeout(function() {
                    scope.completing = true;
                    scope.$apply();
                }, 0);
            }
        };
        document.addEventListener("blur", function(e){
            setTimeout(function() {
                scope.select();
                scope.setIndex(-1);
                scope.$apply();
            }, 150);
        }, true);

        var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};

        element[0].addEventListener("keydown",function (e){

            var keyCode = e.keyCode || e.which;
            var length = angular.element(this).find('li').length;

            if(!scope.completing || length == 0) return;

            switch (keyCode) {
                case key.down:
                    // Do something for "down arrow" key press.
                    index = scope.getIndex()+1;

                    if (index >= length ){
                        index = -1;
                        scope.setIndex(index);
                        scope.$apply();
                        break;
                    }
                    scope.setIndex(index);
                    if(index !== -1) {
                        scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());
                    }
                    break;
                case key.up:
                    // Do something for "up arrow" key press.
                    index = scope.getIndex() - 1;
                    if (index <= -1){
                        index = length;
                        scope.setIndex(index);
                        scope.$apply();
                        break;
                    }
                    scope.setIndex(index);
                    if (index !== -1){
                        scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());
                    }
                    break;
                case key.enter:
                    // Do something for "enter" or "return" key press.
                    if (index !== -1) {
                        var link = angular.element(angular.element(this).find('li')[index]).parent().attr('ng-href');
                    }

                    window.location.href = "" + link + "";
                    break;
                case key.esc:
                    // Do something for "esc" key press.
                    scope.select();
                    scope.setIndex(-1);
                    scope.$apply();
                    e.preventDefault();
                    break;
                default:
                    return; // Quit when this doesn't handle the key event.
            }
        });
    }

    return {
        restrict: 'E',
        scope: {
            searchParam: '=ngModel',
            suggestions: '=data',
            onType: '=onType',
            onSelect: '=onSelect'
        },
        controller: controller,
        link: link,
        template: '\
        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
          <input\
            type="text"\
            ng-model="searchParam"\
            placeholder="{{ attrs.placeholder }}"\
            class="{{ attrs.inputclass }}"\
            id="{{ attrs.inputid }}"/>\
          <ul ng-show="completing && suggestions.length>0">\
          <a\
          ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"\
          ng-href="{{ suggestion.link}}" style=\"text-decoration: none;color: #000000\" \
          >\
            <li\
              suggestion\
              index="{{ $index }}"\
              val="{{ suggestion.name }}"\
              ng-class="{ active: ($index === selectedIndex) }"\
              ng-click="select(suggestion.name)"\
              ng-bind-html="suggestion.name | highlight:searchParam : suggestion.address">\
              </li>\
              </a>\
          </ul>\
        </div>'
    }
});

app.filter('highlight', ['$sce', function ($sce) {
    return function (input, searchParam, address) {
        if (typeof input === 'function') return '';
        if (!searchParam){
            input = input + "<span style=\"display: block\">" + address + "</span>";
            return $sce.trustAsHtml(input);
        }
        if (searchParam) {
            var words = '(' +
                    searchParam.split(/\ /).join(' |') + '|' +
                    searchParam.split(/\ /).join('|') +
                    ')',
                exp = new RegExp(words, 'gi');

            if (words.length) {
                input = input.replace(exp, "<span class=\"highlight\">$1</span>") + "<span style=\"display: block\">" + address + "</span>";
            }
        }

        return $sce.trustAsHtml(input);
    };
}]);

