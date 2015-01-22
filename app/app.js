/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular
        .module('MyApp', [
            'ngDialog',
            'magicsearch',
            'magiccard',
            'autocomplete',
            'lazyloading',
            'angular-loading-bar',
            'ngRoute',
            'angularFileUpload'
        ])
        .config(function ($routeProvider, ngDialogProvider) {
            $routeProvider
                // route for the home page
                .when('/', {
                    templateUrl: 'app/home/templates/home.html',
                    controller: 'homeController'
                })
                .when('/editor/:name', {
                    templateUrl: 'app/editor/templates/editor.html',
                    controller: 'editorController'
                })
                .when('/caption/:name', {
                    templateUrl: 'app/caption/templates/caption.html',
                    controller: 'captionController'
                })
                .when('/user/:userId', {
                    templateUrl: 'app/user/templates/user.html',
                    controller: 'userController'
                })
                .otherwise({redirectTo: '/'});
            ngDialogProvider.setDefaults({
                className: 'ngdialog-theme-plain',
                showClose: true,
                closeByDocument: true,
                closeByEscape: true
            });
        })
        .run(function ($rootScope) {
            $rootScope.url = 'http://localhost:81/projects/Trendy-Server/public/api/';
        });
})(angular);
