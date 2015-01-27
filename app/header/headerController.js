/**
 * Created by tuan on 1/20/2015.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('headerController', headerController);

    headerController.$inject = ['$scope', 'headerService', '$location', 'ngDialog'];

    function headerController($scope, headerService, $location, ngDialog) {

        $scope.imageSelected = function ($files) {
            headerService.upload($files[0])
                .success(function (data) {
                    ngDialog.open({
                        template: 'app/header/templates/confirm.html',
                        className: 'ngdialog-theme-plain',
                        controller: ['$scope', 'headerService', '$window', function ($scope, headerService, $window) {
                            $scope.close = function () {
                                ngDialog.close();
                                $window.location.href = "http://localhost:81/projects/Trendy-Client/#/post?image="
                                + data.upload.image_url + '&title=' + data.upload.name;
                            };
                            $scope.confirm = function () {
                                ngDialog.close();
                                $window.location.href =
                                    "javascript:pixlr.edit({image:'" + data.upload.image_url + "', " +
                                    "title:'" + data.upload.name + "', service:'express', locktitle: 'true', " +
                                    "target:'http://localhost:81/projects/Trendy-Client/#/post', " +
                                    "exit:'http://localhost:81/projects/Trendy-Client/#/'});"
                            }
                        }]
                    });
                })
                .error(function (data) {
                    console.log(data);
                });

        };

        headerService.getUser()
            .success(function (data) {
                $scope.loginUser = data.user;
            })
            .error(function (data) {
                console.log(data);
            });
        $scope.openLogin = function () {
            ngDialog.open({
                template: 'app/header/templates/login.html',
                className: 'ngdialog-theme-plain',
                controller: ['$scope', 'headerService', '$window', function ($scope, headerService, $window) {
                    hello.init({
                        facebook: '725456127540058',
                        google: '103178250738-8o22armgdv5ej7ip215l4inmc1kvmqo9.apps.googleusercontent.com',
                        twitter: '2518012026-WrP1ptaKi9jS3C84BMjqaqkdyjywX0Mfmpadp8Q'
                    }, {
                        scope: 'email'
                    });

                    $scope.login = function (data) {
                        ngDialog.close();
                        hello(data).login().then(function (auth) {
                            hello(auth.network).api('/me').then(function (r) {
                                var data = {};
                                if (auth.network == 'facebook') {
                                    data = {
                                        'email': r.email,
                                        'username': r.name,
                                        'avatar': r.picture + '?width=100&height=100',
                                        'sw_id': r.id,
                                        'gender': r.gender == 'male' ? 0 : 1
                                    };
                                } else if (auth.network == 'google') {
                                    data = {
                                        'email': r.email,
                                        'username': r.name,
                                        'avatar': r.picture.substring(0, r.picture.length - 2) + '100',
                                        'sw_id': r.id,
                                        'gender': r.gender == 'male' ? 0 : 1
                                    };
                                } else if (auth.network == 'twitter') {

                                }

                                headerService.save(data)
                                    .success(function (data) {
                                        $window.location.reload();
                                    })
                                    .error(function (data) {
                                        console.log(data);
                                    });
                            });
                        });
                    }
                }]
            });
        }
    }
})(angular);