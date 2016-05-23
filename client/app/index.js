var config = require('./index.config');
var routes = require('./index.route');
var MainController = require('./main/main.controller');

var name = 'videoPlayer';

//TODO: check if this is correct way to do it
module.exports = angular
    .module(name, [
        require('angular-ui-router')
    ])
    .controller('MainController', MainController)
    .config(config)
    .config(routes);