/**
 * Created by tuan on 1/20/2015.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('headerController', headerController);

    headerController.$inject = ['$scope', 'headerService', '$location', 'ngDialog'];

    function headerController($scope, headerService, $location ,ngDialog) {

        $scope.imageSelected = function($files){
            headerService.upload($files[0])
                .success(function(data){
                    $location.path('/editor/' + data.upload.name);
                })
                .error(function(data){
                    console.log(data);
                });

        }

        headerService.getUser()
            .success(function(data){
                $scope.loginUser = data.user;
            })
            .error(function(data){
                console.log(data);
            });
        $scope.openLogin = function(){
            ngDialog.open({
                template: 'app/header/templates/login.html',
                controller: ['$scope', 'headerService', '$window', function($scope, headerService, $window) {
                    OAuth.initialize('6AVNdARblEuIVDQIlCyRr9ft_sY');

                    $scope.clickConnect = function (provider) {
                        ngDialog.close();
                        //Authorize your user to facebook
                        OAuth.popup(provider).done(function (result) {
                            //Get your user's personal data
                            result.me().done(function (me) {
                                var data = {
                                    'sw_id': me.id,
                                    'email': me.email,
                                    'gender': me.gender,
                                    'username': me.name,
                                    'avatar': me.avatar
                                };
                                headerService.save(data)
                                    .success(function (data) {
                                        $window.location.reload();
                                    })
                                    .error(function (data) {
                                        console.log(data);
                                    });
                            })
                        })
                    };
                }]
            });
        }
    }
})(angular);