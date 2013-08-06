'use strict';

/* Controllers */


angular.module('myApp.controllers', []).

    controller('termCtrl', function ($scope, $http, queryTermsTypes){
        var displayTerms = [];
        var displayTypes = [];
        var allTheTerms;
        var startTerms = [];
        var startTypes = [];

        $http({method:'GET', url:'/query/term'}).
            success(function(data){
                for(var i=0;i<data.length;i++){
                    if (data[i].tags.indexOf("Start") > -1){
                        displayTerms.push(data[i].name);
                    }
                }
                for(i=0;i<data.length;i++){
                    if (data[i].tags.indexOf("Core") > -1 && data[i].tags.indexOf("Type") > -1){
                        displayTypes.push(data[i].name);
                    }
                }
                allTheTerms = data;
                startTerms = displayTerms;
                startTypes = displayTypes;
                $scope.terms=displayTerms;
                $scope.types=displayTypes;


            }).
            error(function(data){
                $scope.terms="Error :("
                $scope.types="Error :("
            });


        $scope.reloadTerms = function(){
            $scope.terms = startTerms;
        };
        $scope.reloadTypes = function(){
            $scope.types = startTypes;
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

                    //dbl click - reload terms and fall through

                    for(i=0;i<allTheTerms.length;i++){
                        var notAgain;
                        if(allTheTerms[i].name === term){
                            if (allTheTerms[i].tags.indexOf("Term") > -1){
                                $scope.test = "you clicked a term";
                                $scope.tests = allTheTerms[i].tags;
                                displayTerms = [];
                                if(term === "Humanities" || term === "Sciences"){
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
                                    notAgain = displayTerms.indexOf(term);
                                    displayTerms.splice(notAgain,1);
                                }
                                if(displayTerms.length>0){
                                    $scope.terms=displayTerms;
                                }else {
                                    alert("No more terms to load!");
                                }
                            } else if(allTheTerms[i].tags.indexOf("Type") > -1){
                                displayTypes=[];
                                for(var i=0;i<allTheTerms.length;i++){
                                    if (allTheTerms[i].tags.indexOf(term) > -1){
                                        displayTypes.push(allTheTerms[i].name);
                                    }
                                }
                                if(displayTypes.indexOf(term) > -1){
                                    notAgain = displayTypes.indexOf(term);
                                    displayTypes.splice(notAgain,1);
                                }
                                if(displayTypes.length>0){
                                    $scope.types=displayTypes;
                                }else {
                                    alert("No more types to load!");
                                }
                            }
                        }
                    }

                case 3:
                    //include term in content query if not already included or excluded
                    if (queryTermsTypes.includedTerms.indexOf(term) < 0 && queryTermsTypes.excludedTerms.indexOf(term) < 0){
                        queryTermsTypes.includedTerms.push(term);
                    };

                    break;
            };
        };
    }).
    controller('add', function ($scope, $http){

        $scope.rate=3;
        $scope.content={};


        $scope.submitNew = function (){

            //validate

            //if image, add to database
            //$http....

            //submit content contents
            $http({
                method:'post',
                url:"",
                params:{}
            }).success().error();

            //submit related terms
            $http({
                method:'post',
                url:"",
                params:{}
            }).success().error();

        }
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


