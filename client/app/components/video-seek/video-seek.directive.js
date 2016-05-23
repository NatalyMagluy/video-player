var template = require('./video-seek.html');
require('./video-seek.scss');

module.exports = function videoSeek() {
    'use strict';

    return {
        restrict: 'E',
        template: template,

        controller: function VideoPlayerController() {
            var vm = this;
        },
        controllerAs: 'seek'
    };
};
