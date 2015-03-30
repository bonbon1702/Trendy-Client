/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('aroundController', aroundController);

    aroundController.$inject = ['$scope', 'ngDialog', 'aroundService', 'headerService', 'userService', 'postService'];

    function aroundController($scope, ngDialog, aroundService, headerService, userService, postService) {
        $scope.busy = false;

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        getLocation();
        function showPosition(position){
            var lat,lng;
            if (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
            } else {
                lat = 21.0249399;
                lng = 105.8457613;
            }

            var data = {
                id: 0,
                lat: lat,
                lng: lng
            };

            aroundService.getPostAround(data)
                .success(function(data){
                    $scope.posts = data.posts;
                })
                .error(function(data){
                    console.log(data);
                });

            $scope.openPost = function(id){
                postService.openPost(id);
            };

            angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

            $scope.nextPage = function(){
                if ($scope.posts) {
                    var length = $scope.posts.length;

                    var data = {
                        'id': length
                    };

                    if ($scope.busy) return;
                    $scope.busy = true;

                    aroundService.getPostAround(data)
                        .success(function (data) {
                            if (data.posts.length != 0) {
                                for (var i =0; i < data.posts.length; i++){
                                    $scope.posts.push(data.posts[i]);
                                }
                                $scope.busy = false;
                            } else {
                                $scope.busy = true;
                            }
                        })
                        .error(function (data) {
                            console.log(data);
                        });
                }
            };

        }


        headerService.loginUser()
            .success(function (data) {
                $scope.loginUser = data.user;
                if (data.user){
                    var data = {
                        'user_avatar' : data.user.picture_profile
                    };
                    googleMap.init(data);
                } else {
                    var data = {
                        'user_avatar' : 'https://cdn4.iconfinder.com/data/icons/ironman_lin/512/ironman_III.png'
                    };
                    googleMap.init(data);
                }
            })
            .error();
    }
})(angular);

