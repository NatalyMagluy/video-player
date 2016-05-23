var template = require('./video-controls.html');
require('./video-controls.scss');

module.exports = function videoControls() {
    return {
        restrict: 'E',
        template: template,
        controller: function VideoPlayerController() {
            var vm = this;
            vm.isPlaying = false;
            vm.currentVolume = 4;
            vm.resolutions = ['480', '720', '1080'];
            vm.fullScreenEntered = false;
            vm.showResolutions = false;
            vm.showModes = false;
        },
        controllerAs: 'controls'
    };
};
