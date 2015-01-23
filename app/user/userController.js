/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('userController', userController);

    userController.$inject = ['$scope', 'ngDialog', '$routeParams', 'userService'];

    function userController($scope, ngDialog, $routeParams, userService) {
        userService.getUser($routeParams.userId)
            .success(function(data){
                $scope.user = data.user;
                console.log($scope.user);
            })
            .error(function(){
                console.log(data);
            });
    }
})(angular);
