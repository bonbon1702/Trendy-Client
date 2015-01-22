/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('postController', postController);

    postController.$inject = ['$scope', 'postService', 'ngDialog'];

    function postController($scope, postService, ngDialog) {
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
        $scope.postsLeft = [];
        $scope.postsRight = [];
        postService.list()
            .success(function (data) {
                for (var i=0; i < data.posts.length; i+=2){
                    $scope.postsLeft.push(data.posts[i]);
                    $scope.postsRight.push(data.posts[i+1]);
                }
            })
            .error(function (data) {
                console.log(data);
            });
        $scope.showDialog = function(id){
            ngDialog.open({
                template: 'app/post/templates/post.html',
                className: 'ngdialog-theme-plain-post',
                controller: ['$scope', 'postService', '$window', function($scope, postService, $window) {

                }]
            });
        }
    }
})(angular);
