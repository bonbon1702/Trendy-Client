/**
 * Created by tuan on 1/20/2015.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('headerController', headerController);

    headerController.$inject = ['$scope', 'headerService', '$location', 'ngDialog', '$pusher', 'ngAudio'];
    function headerController($scope, headerService, $location, ngDialog, $pusher, ngAudio) {
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
        var my_channel = pusher.subscribe('real-time');
        my_channel.bind('notification',
            function (data) {
                for (var i = 0; i < data.user_effected_id.length; i++) {
                    if ($scope.loginUser.id == data.user_effected_id[i].id_of_user_effected) {
                        $scope.notification_unread.push(data);
                        $scope.notification.unshift(data.notification);
                        $scope.sound = ngAudio.load("../assets/sound/beep.mp3");
                        $scope.sound.play();
                    }
                }
            }
        );

        $scope.reader_notification = function () {
            var notifications = [];
            var user_login_id = $scope.loginUser.id;

            for (var i = 0; i < $scope.notification.length; i++) {
                var noti = $scope.notification[i];
                notifications.push({
                    'notification_id': noti.id,
                    'user_id': user_login_id
                })
            }
            headerService.watchedNotification(notifications)
                .success(function (data) {
                    $scope.notification_unread = [];
                })
                .error(function (data) {
                    console.log(data);
                });

        };
        $scope.getShopDetail = function () {

        }

    }

})(angular);

