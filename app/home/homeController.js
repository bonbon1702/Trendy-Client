/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', 'ngDialog', 'homeService', 'headerService'];

    function homeController($scope, ngDialog, homeService, headerService) {

        headerService.loginUser()
            .success(function (data) {
                if (data.user) {
                    var userLogin = data.user;
                    homeService.followSuggestion(0, 'popular', userLogin.id)
                        .success(function (data) {
                            $scope.popuparFollow = data.suggests;
                        });

                    $scope.following = function (id) {
                        var data = {
                            'user_id': id,
                            'follower_id': userLogin.id
                        };

                        userService.addFollow(data)
                            .success(function (data) {
                                homeService.followSuggestion(userLogin.id, 'popular')
                                    .success(function (data) {
                                        $scope.popuparFollow = [];
                                        $scope.popuparFollow = data.suggests;
                                    });
                            });
                    }
                }
            })
            .error();

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

