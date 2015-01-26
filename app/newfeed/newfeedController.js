/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('newfeedController', newfeedController);

    newfeedController.$inject = ['$scope', 'newfeedService', 'ngDialog'];

    function newfeedController($scope, newfeedService, ngDialog) {
        $scope.image = 'http://dwaynepreed.files.wordpress.com/2014/10/beautiful-girl-3.jpg';
        $scope.comment = null;
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
        newfeedService.list()
            .success(function (data) {
                for (var i=0; i < data.posts.length; i+=2){
                    if(data.posts[i] != null ){
                        $scope.postsLeft.push(data.posts[i]);
                    }
                    if(data.posts[i+1] != null){
                        $scope.postsRight.push(data.posts[i+1]);
                    }
                }
            })
            .error(function (data) {
                console.log(data);
            });
        $scope.showDialog = function(id){
            ngDialog.open({
                template: 'app/newfeed/templates/newfeed.html',
                className: 'ngdialog-theme-plain post-dialog',
                controller: ['$scope', 'newfeedService', '$window', function($scope, newfeedService, $window) {
                    newfeedService.get(id)
                        .success(function(data){
                            $scope.post = data.post;

                            $scope.submitComment = function(){
                                var data = {
                                    'content': $scope.comment,
                                    'type_comment': 0,
                                    'type_id': id
                                };
                                $scope.comment = null;
                                newfeedService.save(data)
                                    .success(function(data){
                                        newfeedService.getComments(id)
                                            .success(function(data){
                                                $scope.post.comments = data.comment;
                                            })
                                            .error(function(data){

                                            });
                                    })
                                    .error(function(data){

                                    });
                            };

                            $scope.likeOrDislike = function(){
                                newfeedService.likeOrDislike(id)
                                    .success(function(data){
                                        newfeedService.countLike(id)
                                            .success(function(data){
                                                $scope.post.like = data.like;
                                                $scope.iconLike = !$scope.iconLike;
                                            })
                                            .error();
                                    })
                                    .error(function(data){

                                    });
                            };

                            newfeedService.check(id)
                                .success(function(data){
                                    $scope.iconLike = data.like;
                                })
                                .error();
                        })
                        .error(function(data){

                        });
                }]
            });
        };
    }
})(angular);
