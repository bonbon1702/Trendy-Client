/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('postController', postController);

    postController.$inject = ['$scope'];

    function postController($scope) {
        $scope.image = 'http://dwaynepreed.files.wordpress.com/2014/10/beautiful-girl-3.jpg';
        $scope.points = [
            {
                name: 'ao thoi trang',
                price: '140000',
                top: "241",
                left: "358"
            },
            {
                name: 'quan thoi trang',
                price: '55000',
                top: "181",
                left: "312"
            }
        ];
    }
})(angular);
