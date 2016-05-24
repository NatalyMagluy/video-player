var template = require('./video-seek.html');
require('./video-seek.scss');

module.exports = function videoSeek() {
    'use strict';

    return {
        restrict: 'E',
        template: template,
        scope: {
            bufferedPercentage: '=',
            playedPercentage: '=',
            duration: '=',
            setCurrentTime: '&'
        },
        require: '^player',
        link: function(scope, el, attrs, ctrl) {
            scope.player = ctrl;
            scope.player.addToInit(scope.seek.init.bind(scope.seek));
        },
        controller: function VideoPlayerController($scope, FormatService) {
            var vm = this, seekableSecs;

            angular.extend(vm, {
                init: function () {
                    $scope.player.videoEl.addEventListener('progress', function () {
                        $scope.$applyAsync(function () {
                            var buffered = $scope.player.videoEl.buffered;
                            vm.bufferedPercentage = buffered.length
                                ? (buffered.end(buffered.length - 1) / $scope.player.totalDurationSecs * 100)
                                : 0;
                        });
                    });

                    $scope.player.videoEl.addEventListener('timeupdate', function () {
                        $scope.$applyAsync(function() {
                            vm.playedPercentage = $scope.player.videoEl.currentTime /
                                $scope.player.totalDurationSecs * 100;
                        });
                    });
                },
                onMouseMove: function (event) {
                    var percentage = event.layerX / event.currentTarget.offsetWidth;
                    
                    seekableSecs = $scope.player.totalDurationSecs * percentage;
                    vm.seekableTime = FormatService.parseDuration(seekableSecs);
                    vm.seekedPercentage = percentage * 100;
                    
                    if (vm.seekedPercentage > 94) {
                        vm.seekableTimeOffset = 94;
                    } else if (vm.seekedPercentage < 6) {
                        vm.seekableTimeOffset = 6;
                    } else {
                        vm.seekableTimeOffset = vm.seekedPercentage;
                    }
                },
                setTime: function() {
                    $scope.player.videoEl.currentTime = seekableSecs;
                }
            });


        },
        controllerAs: 'seek'
    };
};
