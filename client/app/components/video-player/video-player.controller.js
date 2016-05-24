module.exports = function PlayerController($scope, $timeout, VideoService, FormatService) {
    var vm = this, initFunctions = [];
    angular.extend(vm, {
        addToInit: function (func) {
            initFunctions.push(func);
        },
        init: function (videoEl) {
            vm.videoEl = videoEl;

            VideoService.init();

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

            VideoService.loadMedia(vm.currentClip.absPath, vm.videoEl);

            vm.videoEl.addEventListener('durationchange', function () {
                $scope.$applyAsync(function () {
                    vm.totalDurationSecs = vm.videoEl.duration;
                    vm.totalDuration = FormatService.parseDuration(vm.videoEl.duration);
                });
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
        },
        changeResolution: function (level) {
            vm.currentClip.resolution = level;
            VideoService.setResolution(level);
        },
        updateClip: function (clip) {
            vm.currentClip = clip;
            document.body.scrollTop = 0;

            VideoService.loadMedia(vm.currentClip.absPath, vm.videoEl);
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
