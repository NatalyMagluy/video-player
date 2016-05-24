var Hls = require('hls.js');

module.exports = function VideoFactory(MseService) {
    var mode, hlsObj, video;
    return {
        setMode: function(useNative) {
            mode = useNative;
            if (!mode) {
                hlsObj = new Hls({
                    autoLevelEnabled: false
                });
            }
        },
        initVideoElement: function(_video) {
            video = _video;
            if (mode) {
                MseService.init(video);
            }
        },
        loadMedia: function(src) {
            video.pause();
            if (!mode) {
                hlsObj.loadSource(src);
                hlsObj.attachMedia(video);
            } else {
                MseService.loadMedia(src);
            }
        },
        setResolution: function(level) {
            if (!mode) {
                hlsObj.currentLevel = level;
            } else {
                MseService.setResolution(level);
            }
        },
        onResolutionsLoaded: function(func) {
            if (!mode) {
                hlsObj.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                    func(data.levels);
                });
            } else {
                MseService.onResolutionsLoaded(func);
            }
        }
    }
};