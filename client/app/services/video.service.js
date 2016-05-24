var Hls = require('hls.js');

module.exports = function VideoFactory() {
    var hlsObj;
    return {
        init: function() {
            hlsObj = new Hls({
                autoLevelEnabled: false
            });
        },
        loadMedia: function(src, video) {
            video.pause();
            hlsObj.loadSource(src);
            hlsObj.attachMedia(video);
        },
        setResolution: function(level) {
            hlsObj.currentLevel = level;
        },
        onResolutionsLoaded: function(func) {
            hlsObj.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                func(data.levels);
            });
        }
    }
};