/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('shopController', shopController);

    shopController.$inject = ['$scope', 'ngDialog', 'shopService'];

    function shopController($scope, ngDialog, shopService) {
        googleMap.init();
    }
})(angular);
