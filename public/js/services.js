'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).

    service('queryTermsTypes', function(){
        return {
            includedTerms : [],
            excludedTerms : [],
            includedTypes : [],
            excludedTypes : []
        };

    });