var template = require('./video-controls.html');
require('./video-controls.scss');

module.exports = function videoControls() {
    return {
        restrict: 'E',
        template: template,
        require: '^player',
        link: function(scope, el, attrs, ctrl) {
            scope.player = ctrl;
            scope.player.addToInit(scope.controls.init.bind(scope.controls));
        },
        controller: function VideoPlayerController($scope) {
            var vm = this, savedVolume;

            function fullScreenHandler() {
                vm.fullScreenEntered = document.fullScreen
                    || document.mozFullScreen || document.webkitIsFullScreen;
            }

            function setCurrentVolume() {
                vm.currentVolume = $scope.player.videoEl.muted ? 0 : $scope.player.videoEl.volume * 10;
            }

            angular.extend(vm, {
                init: function() {
                    setCurrentVolume();

                    $scope.player.videoEl.addEventListener('webkitfullscreenchange', fullScreenHandler);
                    $scope.player.videoEl.addEventListener('mozfullscreenchange', fullScreenHandler);
                    $scope.player.videoEl.addEventListener('fullscreenchange', fullScreenHandler);
                    $scope.player.videoEl.addEventListener('play', function() {
                        $scope.$applyAsync(function() {
                            vm.isPlaying = true;
                        });
                    });
                    $scope.player.videoEl.addEventListener('pause',function() {
                        $scope.$applyAsync(function() {
                            vm.isPlaying = false;
                        });
                    });
                    $scope.player.videoEl.addEventListener('volumechange', $scope.$applyAsync(setCurrentVolume));
                },
                toggleFullScreen: function () {
                    //TODO: refactor
                    if (!vm.fullScreenEntered) {
                        if ($scope.player.videoEl.requestFullscreen) {
                            $scope.player.videoEl.requestFullscreen();
                        } else if ($scope.player.videoEl.msRequestFullscreen) {
                            $scope.player.videoEl.msRequestFullscreen();
                        } else if ($scope.player.videoEl.mozRequestFullScreen) {
                            $scope.player.videoEl.mozRequestFullScreen();
                        } else if ($scope.player.videoEl.webkitRequestFullscreen) {
                            $scope.player.videoEl.webkitRequestFullscreen();
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                },
                togglePlay: function () {
                    vm.restorePlaybackSpeed();
                    if (!vm.isPlaying) {
                        $scope.player.videoEl.play();
                    } else {
                        $scope.player.videoEl.pause();
                    }
                },
                restorePlaybackSpeed: function() {
                    $scope.player.videoEl.playbackRate = 1.0;
                },
                changePlaybackSpeed: function(forward) {
                    if (Math.abs($scope.player.videoEl.playbackRate) < 4) {
                        $scope.player.videoEl.playbackRate = $scope.player.videoEl.playbackRate * 2 * (forward ? 1 : -1);
                    } else {
                        vm.restorePlaybackSpeed();
                    }
                },
                updateVolume: function (volume) {
                    $scope.player.videoEl.volume = volume / 10;
                },
                toggleMuteAudio: function () {
                    $scope.player.videoEl.muted = !$scope.player.videoEl.muted;
                    if ($scope.player.videoEl.muted) {
                        savedVolume = vm.currentVolume;
                        vm.currentVolume = 0;
                    } else {
                        vm.currentVolume = savedVolume;
                    }
                },
                showResolutions: false,
                changeResolution: function(level) {
                    vm.showResolutions = false;
                    $scope.player.changeResolution(level);
                },
                toggleShowSettings: function(toggleResolutions) {
                    var toggleProp = toggleResolutions ? 'showResolutions' : 'showModes',
                        hideProp = !toggleResolutions ? 'showResolutions' : 'showModes';

                    vm[toggleProp] = !vm[toggleProp];
                    vm[hideProp] = false;
                }
            });

        },
        controllerAs: 'controls'
    };
};
