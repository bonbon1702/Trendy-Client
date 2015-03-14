/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', 'ngDialog', 'homeService'];

    function homeController($scope, ngDialog, homeService) {

        googleMap.init();
        homeService.getShopList()
            .success(function (data) {
                googleMap.createMarker(data);
            })
            .error(function (data) {
                console.log(data);
            });
    }
})(angular);

