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
    controller('addContent', function ($scope, $http){
        //controller for adding new content to the library

        var imageTypes = [".jpg",".jpeg",".png",".gif",".jif",".jfif"];
        var linkedImg;
        var imageType;
        var aFileIsBeingAdded;
        var aScreenShotWasTaken;
        var extension; //for uploaded files

        $scope.contentObject = {
            title:"",
            links:"",
            source:"",
            valueStatement:"",
            url:"",
            description:""
        }


        $scope.test = $scope.contentObject.links;
        $scope.test2=$scope.contentObject.source;

        //needed for saving content to server
        var setFileName = function (imageType){
            $scope.contentObject.fileName = ($scope.contentObject.title.toLowerCase().replace(/[^a-z0-9]/g, "_") + imageType);
        };

        //============== DRAG & DROP =============
        // source for drag&drop: http://www.webappers.com/2011/09/28/drag-drop-file-upload-with-html5-javascript/
        var dropbox = document.getElementById("dropbox")
        $scope.dropText = 'Drop files here...'

        // init event handlers
        function dragEnterLeave(evt) {
            evt.stopPropagation()
            evt.preventDefault()
            $scope.$apply(function(){
                $scope.dropText = 'Drop files here...'
                $scope.dropClass = ''
            })
        }

        $scope.urlChange = function(){
            //don't run unless valid url...
            if($scope.contentObject.url !== undefined){
                for (var x in imageTypes){
                    if ($scope.contentObject.url.indexOf(imageTypes[x]) > -1) {
                        $scope.test2 = imageTypes[x];
                        linkedImg = true;
                        aFileIsBeingAdded = true;
                        imageType = imageTypes[x];
                        setFileName(imageType);
                        $scope.test3 = "It's an image!";

                    }
                if ($scope.contentObject.url.toLowerCase().indexOf("watch?") > -1 && $scope.contentObject.url.toLowerCase().indexOf("youtube") > -1){
                    $scope.test3 = "It's a youtube link!";
                    //TODO set embed info (html string)   in content object
                } else if ($scope.contentObject.url.toLowerCase().indexOf("vimeo") > -1){
                    $scope.test3 = "It's vimeo";
                    //TODO set embed info
                } else if ($scope.contentObject.url.toLowerCase().indexOf("ted") > -1 && $scope.contentObject.url.toLowerCase().indexOf("talks") > -1){
                    $scope.test3 = "It's a ted talk!";
                    //TODO set embed info
                } else if (linkedImg === undefined) {
                    $scope.test3 = "It's a website that needs its picture taken!";
                    linkedImg = false;
                    aFileIsBeingAdded = true;
                    //TODO assume website and create preview through javascript
                    //setFilename(".png" or whatever);
                    }
                }
            }

        };



        // **most of the following upload code was adapted from the following jsfiddle: http://jsfiddle.net/danielzen/utp7j/ **

        dropbox.addEventListener("dragenter", dragEnterLeave, false)
        dropbox.addEventListener("dragleave", dragEnterLeave, false)
        dropbox.addEventListener("dragover", function(evt) {
            evt.stopPropagation()
            evt.preventDefault()
            var clazz = 'not-available'
            var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0

            $scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!'
            $scope.dropClass = ok ? 'over' : 'not-available'

        }, false)
        dropbox.addEventListener("drop", function(evt) {
            var files = evt.dataTransfer.files
            var mimeType = files[0].type;
            if (mimeType.indexOf("image") > -1) {
                //get extension
                extension = mimeType.slice(mimeType.indexOf("/"), mimeType.length).replace("/",".");
                aFileIsBeingAdded = true;

                console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
                evt.stopPropagation()
                evt.preventDefault()
                $scope.dropText = 'File will upload upon submission.'
                $scope.dropClass = ''


                if (files.length > 0) {                //TODO delete array bit later - will only ever have one file
                    $scope.files = []
                    for (var i = 0; i < files.length; i++) {
                    $scope.files.push(files[i])
                }

                }
            } else {
                alert ("Must be a valid image file!");
                evt.stopPropagation();
                evt.preventDefault()
            }


        }, false)
        //============== DRAG & DROP =============

        $scope.setFiles = function(element) {
            aFileIsBeingAdded = true
            var mimeType = element.files[0].type;
            if (mimeType.indexOf("image") > -1) {
                //get extension
                extension = mimeType.slice(mimeType.indexOf("/"), mimeType.length).replace("/",".");
            }
            console.log('files:', element.files);
            // Turn the FileList object into an Array
            $scope.files = []
            for (var i = 0; i < element.files.length; i++) {
                $scope.files.push(element.files[i])
            }
            $scope.progressVisible = false

        };



        function uploadProgress(evt) {
            $scope.$apply(function(){
                if (evt.lengthComputable) {
                    $scope.progress = Math.round(evt.loaded * 100 / evt.total)
                } else {
                    $scope.progress = 'unable to compute'
                }
            })
        }

        function uploadComplete(evt) {
            /* This event is raised when the server send back a response */
            alert(evt.target.responseText + "did you send response text? Should this alert be removed?")
        }

        function uploadFailed(evt) {
            alert("There was an error attempting to upload the file.")
        }

        function uploadCanceled(evt) {
            $scope.$apply(function(){
                $scope.progressVisible = false
            })
            alert("The upload has been canceled by the user or the browser dropped the connection.")
        }

        var uploadFile = function() {
            var fd = new FormData()
            for (var i in $scope.files) {
                fd.append("uploadedFile", $scope.files[i])
            }

            var xhr = new XMLHttpRequest()
            xhr.upload.addEventListener("progress", uploadProgress, false)
            xhr.addEventListener("load", uploadComplete, false)
            xhr.addEventListener("error", uploadFailed, false)
            xhr.addEventListener("abort", uploadCanceled, false)
            xhr.open("POST", "/create/fileupload?fileName=" + encodeURI($scope.contentObject.fileName))
            console.log(encodeURI($scope.contentObject.fileName));
            $scope.progressVisible = true
            xhr.send(fd)
        }

        $scope.submitNew = function (){

            //validate and $sanitize content fields, url, types, and dates etc. (if necessary)

            //check identified type against chosen type term - if conflict raise alarm....


            console.log("submit new here");

            if (aFileIsBeingAdded === true){
                console.log("aFileIsBeingAdded to the server");

                //TODO figure out the best way to make the file name unique
                //include incremental number in file name? (do a http request to get current number, add one to it, and return it?)

                if (linkedImg === true){
                    //add extension
                    setFileName(imageType);
                    $http({
                        method:'post',
                        url:"/create/addImage",
                        params:{url:$scope.contentObject.url,
                            fileName:$scope.contentObject.fileName}
                    }).
                        success(
                            $scope.success = "woah! Go see if there is an image!"

                        ).
                        error(
                            $scope.message = "Something went wrong."

                        );

                } else if (aScreenShotWasTaken === true){
                    //TODO upload screen shot

                    //extension will always be the same
                    //setFileName("png or whatever");

                } else {
                    //for uploading local user files
                    setFileName(extension);
                    console.log("hey, the else statement here")
                    uploadFile();
                    console.log($scope.contentObject.fileName);
                }

            }







            //create node and submit content contents
            //create a wrapper function that is called
//            $http({
//                method:'post',
//                url:"/create/createContent",
//                params:{content:$scope.contentObject}
//            }).
//                success(
//                    $scope.message = "It worked! Hopefully in its entirety"
//                    //submit related terms and dates if term created successfully
////                   $http({
////                       method:'post',
////                       url:"",
////                       params:{}
////                   }).success("direct to content page").error()
//
//                ).
//                error(
//                       $scope.message = "Something went wrong."
//
//                );
//

        }
    }).
    controller('content',function($scope, $http, queryTermsTypes){

        //controller for creating search query based on selected terms

        $scope.test = queryTermsTypes.includedTerms;



        //watch array of terms and types for changes and fetch results off of what is selected
            //what kind of issues will come up when a users selects new terms too quickly? (adds terms before first query returns)
        $scope.$watch(function() { return angular.toJson( [ queryTermsTypes.includedTerms, queryTermsTypes.excludedTerms ] ) },
            function() {


                //making the query on the client is probably entirely stupid
                //generate query

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

    }).
    controller('clickMenu', function($scope){
        //function:    set values for buttons in menus when term is clicked
                     //different for already selected terms vs to-be-slected terms

        //onclick startTimer(){
        //      letUp = false;
        //      wait 50ms
        //      if (letUP === false) {
        //               popup the interface
        //}
        // onMouseUp interupt interface(){
        //                  letUp = true;
                                                           //figure out how to implement buttons and graphic at mouse position
       // var id = setTimeout(fn, delay);
//                              function show_coords(event)
//                              {
//                                  var x=event.clientX;
//                                  var y=event.clientY;
//                                  alert("X coords: " + x + ", Y coords: " + y);
//                              }
        //  css
//        h2
//        {
//            position:fixed;
//            left:100px;
//            top:150px;
//        }

        //}
    }).
    controller("createTags",function(){
        //modal window - airplane sketch

    });



