var template = require('./video-clips.html');
require('./video-clips.scss');

module.exports = function videoSeek() {
    'use strict';

    return {
        restrict: 'E',
        template: template,
        controller: function VideoClipsController() {
            // var vm = this;
        },
        controllerAs: 'clips',
        bindToController: {
            clips: '=',
            currentClip: '=',
            updateClip: '&'

        }
    };
};
