/**
 * Created by tuan on 1/20/2015.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('headerController', headerController);

    headerController.$inject = ['$scope', 'headerService', '$location', 'ngDialog', '$pusher'];
    function headerController($scope, headerService, $location, ngDialog, $pusher) {
        $scope.notification = [];
        $scope.notification_unread = [];
        $scope.update = function (type) {
            if (type.length > 1) {
                headerService.search(type)
                    .success(function (data) {
                        $scope.data = [];
                        for (var i = 0; i < data.results.length; i++) {
                            var res = {
                                name: data.results[i].name,
                                sub: data.results[i].sub,
                                image: data.results[i].image,
                                url: data.results[i].url
                            };
                            $scope.data.push(res);
                        }
                    })
                    .error(function (data) {
                        console.log(data);
                    });
            }
        };
        hello.init({
            facebook: '513861542088702',
            google: '103178250738-8o22armgdv5ej7ip215l4inmc1kvmqo9.apps.googleusercontent.com',
            twitter: '2518012026-WrP1ptaKi9jS3C84BMjqaqkdyjywX0Mfmpadp8Q'
        }, {
            scope: 'email'
        });

        $scope.checkLogin = function () {
            if (!$scope.loginUser) {
                headerService.openLogin();
                event.stopPropagation();
                event.preventDefault();
            }
        };
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
                                    + data.upload.image_url + '&title=' + data.upload.name + '&editor=false';
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

        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
                if ($scope.loginUser) {
                    headerService.getNotification($scope.loginUser.id)
                        .success(function (data) {
                            if (data) {
                                data.notification.notification.sort(function (a, b) {
                                    return b.id - a.id;
                                });

                                for (var i = 0; i < data.notification.notification.length; i++) {
                                    var noti = data.notification.notification[i];
                                    if (noti.id_of_user_effected !== $scope.loginUser.id) {
                                        $scope.notification.push(noti);
                                    }
                                }
                                for (var i = 0; i < data.notification.notification_unread.length; i++) {
                                    var noti = data.notification.notification_unread[i];
                                    if (noti.id_of_user_effected !== $scope.loginUser.id) {
                                        $scope.notification_unread.push(noti);
                                    }
                                }
                            }
                        });
                }
            })
            .error(function (data) {
                console.log(data);
            });

        $scope.openLogin = function () {
            headerService.openLogin();
        };

        $scope.logout = function () {
            hello("facebook").logout();
            hello("google").logout();
            $window.location.reload();
        }

        var client = new Pusher('4c33474dc0a36d3a912d');
        var pusher = $pusher(client);
        var my_channel = pusher.subscribe('notification');
        my_channel.bind('comment',
            function (data) {
                $scope.notification_unread.push(data);
                $scope.notification.unshift(data.notification);
            }
        );

        my_channel.bind('like',
            function(data){
                $scope.notification_unread.push(data);
                $scope.notification.unshift(data.notification);
            }
        );
        $scope.reader_notification = function () {
            var data = {
                'user_id': $scope.loginUser.id,
                'notification_id': $scope.notification.id
            }

        }
    }
})(angular);