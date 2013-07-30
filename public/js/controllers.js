'use strict';

/* Controllers */

    //things to do:
        //term/type ctrl: load all relevant terms, not just last clicked - used array to hold terms between loads?

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
        $scope.items = [
            "The first choice!",
            "And another choice for you.",
            "but wait! A third!"
        ];
  }).
    controller('MyCtrl2', function ($scope){
        //blach
    }).
    controller('typeCtrl', function ($scope, $http, queryTermsTypes){

        var displayTypes = [];
        var allTheTypes;
        var start = [];
        $scope.incTypes = queryTermsTypes.includedTypes;
        $scope.excTypes = queryTermsTypes.excludedTypes;

        $http({method:'GET', url:'/query/type'}).
             success(function(data){
                 for(var i=0;i<data.length;i++){
                     if (data[i].tags.indexOf("Core") > -1){
                         displayTypes.push(data[i].name);
                     }
                 }
                 allTheTypes = data;
                 start = displayTypes;
                 $scope.display=displayTypes;
             }).
             error(function(data){
                 $scope.type="Error :("
             });

        $scope.reload = function(){
            $scope.display = start;
        };

        $scope.includeExclude = function (number, type){
            switch (number)
            {
                case 1:
                    //exclude type
                    if (queryTermsTypes.excludedTypes.indexOf(type) < 0 && queryTermsTypes.includedTypes.indexOf(type) < 0){
                        queryTermsTypes.excludedTypes.push(type);
                    };
                    break;
                case 2:

                    //reload types

                    displayTypes = [];
                    for(var i=0;i<allTheTypes.length;i++){
                        if (allTheTypes[i].tags.indexOf(type) > -1){
                            displayTypes.push(allTheTypes[i].name);
                        }
                    }
                    var notAgain = displayTypes.indexOf(type);
                    displayTypes.splice(notAgain,1);
                    if(displayTypes.length>0){
                        $scope.display=displayTypes;
                    }else {
                        alert("No more terms to load!");
                    };

                case 3:
                    //include type in content query
                    if (queryTermsTypes.includedTypes.indexOf(type) < 0 && queryTermsTypes.excludedTypes.indexOf(type) < 0){
                        queryTermsTypes.includedTypes.push(type);
                    };

                    break;
            };
        };
  }).
    controller('testCtrl', function ($scope, $http){
        $http({method:'GET', url:'/query/type'}).
            success(function(data){

                $scope.data=data;
            }).
            error(function(data){
                $scope.type="Error :("
            });

}).
    controller('termCtrl', function ($scope, $http, queryTermsTypes){


        var displayTerms = [];
        var allTheTerms;
        var start = [];
        $scope.incTermsMatch = queryTermsTypes.includedTerms;
        $scope.excTerms = queryTermsTypes.excludedTerms;

        $http({method:'GET', url:'/query/term'}).
            success(function(data){
                for(var i=0;i<data.length;i++){
                    if (data[i].tags.indexOf("Start") > -1){
                        displayTerms.push(data[i].name);
                    }
                }
                allTheTerms = data;
                start = displayTerms;
                $scope.display=displayTerms;
            }).
            error(function(data){
                $scope.term="Error :("
            });

        $scope.reload = function(){
            $scope.display = start;
        };

        $scope.includeExclude = function (number, term){
            switch (number)
            {
                case 1:
                    //exclude terms - make sure the term isn't already in the included or excluded arrays
                    if (queryTermsTypes.excludedTerms.indexOf(term) < 0 && queryTermsTypes.includedTerms.indexOf(term) < 0){
                        queryTermsTypes.excludedTerms.push(term);
                    };
                    break;
                case 2:

                    //reload terms

                    displayTerms = [];
                    if(term === "Humanities"){
                        for(var i=0;i<allTheTerms.length;i++){
                            if (allTheTerms[i].tags.indexOf("Core") > -1 && allTheTerms[i].tags.indexOf(term) > -1){
                                displayTerms.push(allTheTerms[i].name);
                            }
                        }
                    } else if(term === "Sciences") {
                        for(var i=0;i<allTheTerms.length;i++){
                            if (allTheTerms[i].tags.indexOf("Core") > -1 && allTheTerms[i].tags.indexOf(term) > -1){
                                displayTerms.push(allTheTerms[i].name);
                            }
                        }
                    } else {
                        for(var i=0;i<allTheTerms.length;i++){
                            if (allTheTerms[i].tags.indexOf(term) > -1){
                                displayTerms.push(allTheTerms[i].name);
                            }
                        }
                    }

                    if(displayTerms.indexOf(term) > -1){
                        var notAgain = displayTerms.indexOf(term);
                        displayTerms.splice(notAgain,1);
                    }
                    if(displayTerms.length>0){
                        $scope.display=displayTerms;
                    }else {
                        alert("No more types to load!");
                    }

                case 3:
                    //include term in content query
                    if (queryTermsTypes.includedTerms.indexOf(term) < 0 && queryTermsTypes.excludedTerms.indexOf(term) < 0){
                        queryTermsTypes.includedTerms.push(term);
                    };

                    break;
            };
        };
    }).
    controller('add', function ($scope){
        //blah
    }).
    controller('content',function($scope, $http, queryTermsTypes){

        $scope.test = queryTermsTypes.includedTerms;



        //watch array of terms and types for changes and fetch results off of what is selected
        $scope.$watch(function() { return angular.toJson( [ queryTermsTypes.includedTerms, queryTermsTypes.excludedTerms ] ) },
            function() {

                //generate query  - should this be done on the server for security reasons?

                //username:user-[z]-n:content   -  will need to include this later (for blocked/favorited content)
                var incTermsMatch = ("");
                var exTermsMatch = ("");
                var incTermsWhere = ("");
                var exTermsWhere = ("");
                var match = ("MATCH ");
                var where = ("WHERE ");
                var queryString = ("");
                //create match part of query
                for(var i=0;i<queryTermsTypes.includedTerms.length;i++){
                    incTermsMatch +=  (queryTermsTypes.includedTerms[i] + ":" + queryTermsTypes.includedTerms[i] + "-[:tagged_with]-n:content,")
                }
                for(var i=0;i<queryTermsTypes.excludedTerms.length;i++){
                    exTermsMatch += (queryTermsTypes.excludedTerms[i] + ":" + queryTermsTypes.excludedTerms[i] + "-[:tagged_with]-n:content,")
                }
                match += incTermsMatch.concat(exTermsMatch);
                //remove last comma
                match = match.slice(0,-1);

                for(var i=0;i<queryTermsTypes.includedTerms.length;i++){
                    incTermsWhere +=  (queryTermsTypes.includedTerms[i] + ".name = \"" + queryTermsTypes.includedTerms[i] + "\" AND ")
                }
                for(var i=0;i<queryTermsTypes.excludedTerms.length;i++){
                    exTermsWhere += (queryTermsTypes.excludedTerms[i] + ".name <> \"" + queryTermsTypes.excludedTerms[i] + "\" AND ")
                }

                where += incTermsWhere.concat(exTermsWhere);
                //remove last "and"
                where = where.slice(0,-4);

                queryString = queryString.concat(match + " " + where + "RETURN n.name AS name");

                console.log(queryString);

                $http({
                    method:'get',
                    url:'/query/getContent',    //will need to include user ID for 'blocked' or 'favorited' content searches
//                    params: {includeTerms:queryTermsTypes.includedTerms , excludeTerms:queryTermsTypes.excludedTerms,
//                             includeTypes:queryTermsTypes.includedTypes , excludeTypes:queryTermsTypes.excludedTypes }
                    params: {query:queryString }

                }).
                success(function(data){
                        //feed data to scope display for viewing
                        $scope.test = data;

                }).
                error(function(data){
                        $scope.test = "Error :("

                });
            });

    });


