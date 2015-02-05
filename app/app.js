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
            'angularFileUpload',
            'infinite-scroll',
            'ngTagsInput'
        ])
        .config(function ($routeProvider, ngDialogProvider, $locationProvider) {
            $routeProvider
                // route for the home page
                .when('/', {
                    templateUrl: 'app/home/templates/home.html',
                    controller: 'homeController'
                })
                .when('/post', {
                    templateUrl: 'app/post/templates/post.html',
                    controller: 'postController',
                    reloadOnSearch: false
                })
                .when('/user/:userId', {
                    templateUrl: 'app/user/templates/user.html',
                    controller: 'userController'
                })
                .when('/#tab1-3', {
                    templateUrl: 'app/user/templates/user.html',
                    controller: 'userController'
                })
                .when('/#tab2-3', {
                    templateUrl: 'app/user/templates/user.html',
                    controller: 'userController'
                })
                .when('/#tab3-3', {
                    templateUrl: 'app/user/templates/user.html',
                    controller: 'userController'
                })
                .when('/#tab4-3', {
                    templateUrl: 'app/user/templates/user.html',
                    controller: 'userController'
                })
                .when('/following/:userId', {
                    templateUrl: 'app/user/templates/following.html',
                    controller: 'userController'
                })
                .when('/follower/:userId', {
                    templateUrl: 'app/user/templates/follower.html',
                    controller: 'userController'
                })
                .when('/shop/:shopId', {
                    templateUrl: 'app/shop/templates/shop.html',
                    controller: 'shopController'
                })
                .otherwise({redirectTo: '/'});
            ngDialogProvider.setDefaults({
                showClose: true,
                closeByDocument: true,
                closeByEscape: true
            });
        })
        .run(function ($rootScope) {
            $rootScope.url = 'http://localhost:81/projects/Trendy-Server/public/api/';
            //$rootScope.url = 'http://104.43.9.177/api/';
        });
})(angular);
