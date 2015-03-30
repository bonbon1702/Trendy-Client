/**
 * Created by tuan on 1/20/2015.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('headerController', headerController);

    headerController.$inject = ['$scope', 'headerService', '$location', 'ngDialog', 'ngAudio', '$window', 'postService'];
    function headerController($scope, headerService, $location, ngDialog, ngAudio, $window, postService) {
        $scope.notification = [];
        $scope.notification_unread = [];
        $scope.trendy = true;
        $scope.typeClick = $location.path();

        $scope.navBar = function(type){
            $scope.typeClick = type;
        };

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
            facebook: '849978158393821',
            google: '103178250738-8o22armgdv5ej7ip215l4inmc1kvmqo9.apps.googleusercontent.com',
            twitter: '2518012026-WrP1ptaKi9jS3C84BMjqaqkdyjywX0Mfmpadp8Q'
        }, {
            scope: 'email'
        });

        $scope.checkLogin = function () {
            headerService.openLogin();
        };
        $scope.imageSelected = function ($files) {
            headerService.upload($files[0])
                .success(function (data) {
                    ngDialog.open({
                        template: 'app/header/templates/confirm.html',
                        className: 'ngdialog-theme-plain',
                        controller: ['$scope', 'headerService', '$window', '$location', function ($scope, headerService, $window, $location) {
                            $scope.close = function () {
                                ngDialog.close();
                                //$window.location.href = "http://trendyplus.dev/post?image="
                                //+ data.upload.image_url + '&title=' + data.upload.name + '&editor=false';
                                $location.path('/post');
                                $location.search({
                                    image: data.upload.image_url,
                                    title: data.upload.name,
                                    editor: 'false'
                                });
                            }
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
                                        if (noti.user_id != $scope.loginUser.id && noti.action == 'like') {

                                        } else {
                                            noti.created_at = beautyDate.prettyDate(noti.created_at);
                                            $scope.notification.push(noti);
                                        }
                                    }
                                }

                                for (var i = 0; i < data.notification.notification_unread.length; i++) {
                                    var noti = data.notification.notification_unread[i];
                                    if (noti.id_of_user_effected !== $scope.loginUser.id) {
                                        if (noti.user_id != $scope.loginUser.id && noti.action == 'like') {

                                        } else {
                                            $scope.notification_unread.push(noti);
                                        }

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
        };

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

        var socket = io.connect('http://127.0.0.1:3000/');

        socket.on('realTime.notification', function (data) {
            //Do something with data
            var results = JSON.parse(data);

            if ($scope.loginUser.id != results.id_of_user_effected) {
                if (results.user_id != $scope.loginUser.id && (results.action == 'like' || results.action == 'favorite')) {

                } else {
                    for (var i=0; i < results.list_user.length; i++) {
                        if ($scope.loginUser.id == results.list_user[i].id_of_user_effected) {
                            $scope.notification_unread.push(results);
                            $scope.notification.unshift(results);
                            $scope.sound = ngAudio.load("../assets/sound/beep.mp3");
                            $scope.sound.play();
                        }
                    }
                }
            }
        });

        $scope.getShopDetail = function () {

        };

        $scope.clickNavBar= function () {
            $scope.trendy = false;
        };

        $scope.clickNavBarTrendy= function () {
            $scope.trendy = true;
        }

        $scope.openPost = function(id){
            postService.openPost(id);
        }
    }

})(angular);

