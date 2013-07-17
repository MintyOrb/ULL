'use strict';

/* Controllers */

angular.module('myApp.controllers', []).

    controller('AppCtrl', function ($scope, $http) {
        $http({
          method: 'GET',
          url: '/api/name'
        }).
        success(function (data, status, headers, config) {
          $scope.name = data.name;
        }).
        error(function (data, status, headers, config) {
          $scope.name = 'Error!'
        });

  }).
    controller('MyCtrl1', function ($scope) {
    // write Ctrl here

  }).
    controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  }).
    controller('typeCtrl', function ($scope, $http){
        var theList = [];
        var alltheterms;
        $http({method:'GET', url:'/query/type'}).
             success(function(data){
                 for(var i=0;i<data.length;i++){
                     if (data[i].tags.indexOf("Core") > -1){
                         theList.push(data[i].name);
                     }
                 }
                 alltheterms = data;
                 $scope.display=theList;
                 $scope.label = theList;
             }).
             error(function(data){
                 $scope.type="Error :("
             });
        $scope.value="not set yet"
        $scope.whatsmyname = function (value){
            $scope.value=value;
            theList = [];
            for(var i=0;i<alltheterms.length;i++){
                if (alltheterms[i].tags.indexOf(value) > -1){
                    theList.push(alltheterms[i].name);
                }
            }
            var notAgain = theList.indexOf(value);
            theList.splice(notAgain,1);
            $scope.display=theList;
            $scope.label = theList;
        }
  }).
    controller('testCtrl', function ($scope, $http){
        $http({method:'GET', url:'/query/test'}).
            success(function(data){

                $scope.data=data;
            }).
            error(function(data){
                $scope.type="Error :("
            });
}).
    controller('add', function ($scope){
       // $scope.isthis="working";

    })  ;