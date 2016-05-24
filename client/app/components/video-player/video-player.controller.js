module.exports = function PlayerController($document, $scope, $timeout, $rootScope, VideoService, FormatService) {
    var vm = this, initFunctions = [], clips = vm.clips;


    angular.extend(vm, {
        isNativeMode: false,
        setMode: function(isNativeMode) {
            vm.isNativeMode = isNativeMode;

            VideoService.setMode(vm.isNativeMode);
            VideoService.initVideoElement(vm.videoEl);

            vm.clips = _.reject(clips, function(clip) {
                return !clip[vm.isNativeMode ? 'dashAbsPath' : 'absPath'];
            });

            vm.currentClip = vm.clips[0];
            vm.totalDuration = '00:00:00';
            vm.currentTime = '00:00:00';

            document.body.scrollTop = 0;

            VideoService.onResolutionsLoaded(function (data) {
                $scope.$applyAsync(function () {
                    vm.isLoading = false;
                    vm.currentClip.resolutions = FormatService.parseLevels(data);
                    vm.currentClip.resolution = 0;
                    //vm.changeResolution(0);

                    //issue in Chrome: https://bugs.chromium.org/p/chromium/issues/detail?id=593273
                    $timeout(function () {
                        if (vm.videoEl.paused) {
                            vm.videoEl.play();
                        }
                    }, 150);

                });
            });

            VideoService.loadMedia(vm.isNativeMode ? vm.currentClip.dashAbsPath : vm.currentClip.absPath);

        },
        addToInit: function (func) {
            initFunctions.push(func);
        },
        init: function (videoEl) {
            vm.videoEl = videoEl;

            vm.setMode(vm.isNativeMode);

            vm.videoEl.addEventListener('durationchange', function () {
                if (isFinite(vm.videoEl.duration)) {
                    $scope.$applyAsync(function () {
                        vm.totalDurationSecs = vm.videoEl.duration;
                        vm.totalDuration = FormatService.parseDuration(vm.videoEl.duration);
                    });
                }
            });

            vm.videoEl.addEventListener('timeupdate', function () {
                $scope.$applyAsync(function () {
                    vm.currentTime = FormatService.parseDuration(vm.videoEl.currentTime);
                    if (vm.videoEl.currentTime >= vm.totalDurationSecs) {
                        vm.videoEl.pause();
                    }
                });
            });

            _.each(initFunctions, function (init) {
                init();
            });

            //todo: show bottom panel on mouseenter and hide on mousemove rather than on hover
            //todo: when mouse is over video element but there wasn't any movement for three seconds, hide the bottom panel
        },
        changeResolution: function (level) {
            vm.currentClip.resolution = level;
            VideoService.setResolution(level);
        },
        updateClip: function (clip) {
            vm.currentClip = clip;
            document.body.scrollTop = 0;

            VideoService.loadMedia(vm.isNativeMode ? vm.currentClip.dashAbsPath : vm.currentClip.absPath);
        },
        goToNextVideo: function (forward) {
            var currentClipIndex = _.indexOf(vm.clips, vm.currentClip);
            currentClipIndex += forward ? 1 : -1;

            if (currentClipIndex < 0) {
                currentClipIndex = vm.clips.length - 1;
            } else if (currentClipIndex === vm.clips.length) {
                currentClipIndex = 0;
            }

            vm.updateClip(vm.clips[currentClipIndex]);
        }
    });
};
