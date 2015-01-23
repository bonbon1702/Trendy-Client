/**
 * Created by tuan on 12/30/2014.
 */
(function (angular) {
    angular.module('MyApp')
        .controller('editorController', editorController);

    editorController.$inject = ['$scope', 'editorService', '$location', '$routeParams'];

    function editorController($scope, editorService, $location, $routeParam) {
        //Caman("#photoCanvas", function () {
        //    this.render();
        //});
        //
        editorService.get($routeParam.name)
            .success(function (data) {
                $scope.image = data.upload;
                window.location.href =
                    "javascript:pixlr.edit({image:'" + $scope.image.image_url + "', " +
                    "title:'" + $scope.image.name + "', service:'express', " +
                    "target:'http://localhost:81/projects/Trendy-Client/#/caption', " +
                    "exit:'http://localhost:81/projects/Trendy-Client/#/'});"

            })
            .error(function (data) {

            });
        //
        //$scope.editor = function(method){
        //    Caman("#photoCanvas", function(){
        //        this.revert(false);
        //        this[method]();
        //        this.render();
        //    });
        //};
        //
        //$scope.submit = function() {
        //    Caman("#photoCanvas", function () {
        //        var image = this.toBase64();
        //        var data = {
        //            img: image,
        //            name: $scope.image.name
        //        };
        //        editorService.save(data)
        //            .success(function(data) {
        //                $location.path('/caption/' + data.upload.name);
        //            })
        //            .error(function(data) {
        //                console.log(data);
        //            });
        //    });
        //}
    }
})(angular);