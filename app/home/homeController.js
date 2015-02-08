/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', 'ngDialog', 'homeService'];

    function homeController($scope, ngDialog, homeService) {

//        homeService.map()
//            .success(function (data) {
//                var map = [];
//                for (var i = 0; i < data.posts.length; i++) {
//                    if (data.posts[i] != null) {
//                        var item = {
//                            'caption': data.posts[i],
//                            'image_url': data.posts[i].image_url,
//                            'lat': data.posts[i].lat,
//                            'lang': data.posts[i].lang,
//                            'address': data.posts[i].address
//                        };
//                        map.push(item);
//                    }
//                }
//                googleMap.init(map);
//            })
//            .error(function (data) {
//                console.log(data);
//            });
        googleMap.init();

    }
})(angular);

