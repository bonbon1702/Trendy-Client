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
            'imageFill',
            'hoverCard'
        ])
        .config(function ($routeProvider,$stateProvider, ngDialogProvider, $locationProvider) {
            $routeProvider
                // route for the home page
                .when('/', {
                    templateUrl: 'app/trendy/templates/trendy.html',
                    controller: 'trendyController'
                })
                .when('/tag/:content', {
                    templateUrl: 'app/trendy/templates/trendyTag.html',
                    controller: 'trendyTagController'
                })
                .when('/post/:id',{
                    templateUrl: 'app/post/templates/postDetailPage.html',
                    controller: 'postDetailController',
                    reloadOnSearch: false
                })
                .when('/newsfeed', {
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

            $locationProvider.html5Mode(true);
            ngDialogProvider.setDefaults({
                showClose: true,
                closeByDocument: true,
                closeByEscape: true
            });

        })
        .run(function ($rootScope, $location,$route,$timeout) {
            var original = $location.path;
            $location.path = function (path, reload) {
                if (reload === false) {
                    var lastRoute = $route.current;
                    if (lastRoute) {
                        var un = $rootScope.$on('$locationChangeSuccess', function () {
                            $route.current = lastRoute;
                            $route.current.ignore = true;
                            un();
                        });
                        $timeout(function(){
                            un()
                        }, 500);
                    }
                }
                return original.apply($location, [path]);
            };
            //$rootScope.url = 'http://103.7.40.222:8081/api/';
            $rootScope.url = 'http://trendy-server.dev/api/';
        });
})(angular);
