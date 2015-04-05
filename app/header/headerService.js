/**
 * Created by tuan on 1/20/2015.
 */
(function (angular) {
    angular.module('MyApp')
        .factory('headerService', headerService);

    headerService.$inject = ['$http', '$rootScope', '$upload', 'ngDialog'];

    function headerService($http, $rootScope, $upload, ngDialog) {
        return {
            save: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'user/createUser',
                    data: data
                });
            },
            upload: function (data) {
                return $upload.upload({
                    url: $rootScope.url + 'upload/uploadPicture',
                    headers: {'Content-Type': data.type},
                    method: 'POST',
                    file: data,
                    data: data
                });
            },
            loginUser: function () {
                if (hello("google").getAuthResponse() != null) {
                    var nw = hello("google").getAuthResponse();
                } else if (hello("facebook").getAuthResponse() != null) {
                    var nw = hello("facebook").getAuthResponse();
                }
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'user/getLoginUser',
                    data: {
                        remember_token: nw ? nw.access_token : ''
                    }
                });
            },
            getUser: function (data) {
                return $http.get($rootScope.url + 'user/getUser/' + data);
            },
            search: function (data) {
                return $http.get($rootScope.url + 'searchAllPage/' + data);
            },
            openLogin: function () {
                return ngDialog.open({
                    template: 'app/header/templates/login.html',
                    className: 'ngdialog-theme-plain',
                    controller: ['$scope', 'headerService', '$window', '$location', '$route', function ($scope, headerService, $window, $location, $route) {
                        //$rootScope.$on('ngDialog.closing', function (e, $dialog) {
                        //    $location.path("/");
                        //});
                        $scope.login = function (data) {
                            ngDialog.close();
                            hello(data).login({
                                force: false,
                                redirect_uri: 'http://trendyplus.org/redirect.html'
                            }).then(function (auth) {
                                hello(auth.network).api('/me').then(function (r) {
                                    var data = {};
                                    if (auth.network == 'facebook') {
                                        var fb = hello("facebook").getAuthResponse();
                                        data = {
                                            'email': r.email,
                                            'username': r.name,
                                            'avatar': r.picture + '?width=100&height=100',
                                            'sw_id': r.id,
                                            'gender': r.gender == 'male' ? 0 : 1,
                                            'remember_token': fb.access_token
                                        };
                                    } else if (auth.network == 'google') {
                                        var google = hello("google").getAuthResponse();
                                        data = {
                                            'email': r.email,
                                            'username': r.name,
                                            'avatar': r.picture.substring(0, r.picture.length - 2) + '100',
                                            'sw_id': '',
                                            'gender': r.gender == 'male' ? 0 : 1,
                                            'remember_token': google.access_token
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
            },
            getNotification: function (user_id) {
                return $http.get($rootScope.url + 'notification/getNotificationByUserId/' + user_id);
            },
            watchedNotification: function (data) {
                return $http({
                    method: 'POST',
                    url: $rootScope.url + 'notification/watchedNotification',
                    data: data,
                    ignoreLoadingBar: true
                });
            }
        }
    }
})(angular);