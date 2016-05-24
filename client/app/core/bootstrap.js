'use strict';
require('./include')();
// load the main app file
var appModule = require('../index');
require('./constants')();

// replaces ng-app="appName"
angular.element(document).ready(function () {
    angular.bootstrap(document, [appModule.name], {
        //strictDi: true
    });
});