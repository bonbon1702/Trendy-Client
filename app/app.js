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
            'ui.router',
            'ui.bootstrap',
            'ngAudio',
            'akoenig.deckgrid',
            'masonry',
            'ngImgCrop',
            'base64',
            'imageFill'
        ])
        .config(function ($routeProvider,$stateProvider, ngDialogProvider, $locationProvider) {
            $routeProvider
                // route for the home page
                .when('/', {
                    templateUrl: 'app/trendy/templates/trendy.html',
                    controller: 'trendyController'
                })
                .when('/newfeed', {
                    templateUrl: 'app/newfeed/templates/newfeed.html',
                    controller: 'newfeedController'
                })
                .when('/favorite', {
                    templateUrl: 'app/favorite/templates/favorite.html',
                    controller: 'favoriteController'
                })
                .when('/around', {
                    templateUrl: 'app/around/templates/around.html',
                    controller: 'aroundController'
                })
                .when('/post', {
                    templateUrl: 'app/post/templates/post.html',
                    controller: 'postController',
                    reloadOnSearch: false
                })
                .when('/post/:id',{
                    templateUrl: 'app/post/templates/postDetail.html',
                    controller: 'PostController'
                })
                .when('/user/:userId', {
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
            $locationProvider.html5Mode(true);
        })
        .run(function ($rootScope) {
            //$rootScope.url = 'http://localhost:81/projects/Trendy-Server/public/api/';
            //$rootScope.url = 'http://104.43.9.177/api/';
            $rootScope.url = 'http://trendy-server.dev/api/';
        });
})(angular);
