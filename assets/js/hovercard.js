/**
 * Created by nghia on 02/04/2015.
 */
var app = angular.module('hoverCard', []);

app.directive('hoverCard', function () {
    return {
        restrict: 'A',
        link: link,
        controller: function($scope, ngDialog){
            $scope.closeDialog = function(){
                ngDialog.close();
            }
        }
    };

    function link(scope, element, attrs) {
        var text ="<p style='padding-top: 10px'>" + '<i class="fa fa-picture-o fa-2x"></i><span style="padding-left: 10px;">' +  attrs.pointName + "</span></p>"
        + "<p>" + '<i class="fa fa-usd fa-2x"></i><span style="padding-left: 21px;color: red;">' + attrs.pointPrice + ' VND' + "</span></p>"
        + "<p>" + '<i class="fa fa-home fa-2x"></i><a ng-click="closeDialog()" style="padding-left: 13px;color: #000000" href="/shop/'+ attrs.pointAid +'">' + attrs.pointAddress + "</a></p>";
        angular.element(element).hovercard({
            detailsHTML : text,
            width: 250
        });
    }
});