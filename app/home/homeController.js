/**
 * Created by tuan on 11/1/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', 'ngDialog', 'homeService'];

    function homeController($scope, ngDialog, homeService) {
        googleMap.init();
        //$scope.movies = [
        //    {
        //        'name' : "Lord of the Rings",
        //        'address' : '32 Lac trung',
        //        'link': 'facebook'
        //    },
        //    {
        //        'name' : "Drive",
        //        'address' : '25 drive'
        //    },
        //    {
        //        'name' : "Science of Sleep",
        //        'address' : '64 Science'
        //    },
        //    {
        //        'name' : "Back to the Future",
        //        'address' : '15 back'
        //    },
        //    {
        //        'name' : "Oldboy",
        //        'address' : '11 Oldboy'
        //    }];
        //$scope.updateMovies = function(text){
        //    console.log(text);
        //}
        //
        //$scope.points = [
        //    {
        //        name: 'ao thoi trang',
        //        price: '140000',
        //        top: "241",
        //        left: "358"
        //    },
        //    {
        //        name: 'quan thoi trang',
        //        price: '55000',
        //        top: "181",
        //        left: "312"
        //    }
        //];
        //$scope.callback = function (point) {
        //    var point = {
        //        name: point[2],
        //        top: point[0],
        //        left: point[1]
        //    };
        //    $scope.points.push(point);
        //    $scope.$apply();
        //}
        //$scope.clickToOpen = function () {
        //
        //    ngDialog.open({
        //        template: 'app/home/templates/templateTag.html',
        //        className: 'ngdialog-theme-plain'
        //    });
        //};

        $scope.postsLeft = [];
        $scope.postsRight = [];
        homeService.list()
            .success(function (data) {
                for (var i=0; i < data.posts.length; i+=2){
                    $scope.postsLeft.push(data.posts[i]);
                    $scope.postsRight.push(data.posts[i+1]);
                }
            })
            .error(function (data) {
                console.log(data);
            });

    }
})(angular);

