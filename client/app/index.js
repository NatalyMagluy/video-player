var config = require('./index.config');
var routes = require('./index.route');
var MainController = require('./main/main.controller');

var mainHeaderDirective = require('./components/main-header/main-header.directive');
var playerDirective = require('./components/video-player/video-player.directive');
var videoSeekDirective = require('./components/video-seek/video-seek.directive');
var videoControlsDirective = require('./components/video-controls/video-controls.directive');

var name = 'videoPlayer';

//TODO: check if this is correct way to do it
module.exports = angular
    .module(name, [
        require('angular-ui-router')
    ])
    .controller('MainController', MainController)
    .directive('mainHeader', mainHeaderDirective)
    .directive('player', playerDirective)
    .directive('videoSeek', videoSeekDirective)
    .directive('videoControls', videoControlsDirective)
    .config(config)
    .config(routes);