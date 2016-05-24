var X2JS = require('x2js');

module.exports = function MseService(XhrService, $rootScope) {
    var x2js = new X2JS(), callbacks = [],
        durationRegExp = /^PT(?:(\d+)H)*(?:(\d+)M)(?:(\d+)S)/gi,
        mediaSource, video, src, manifest, buffers;

    function getBaseUrl(url) {
        return url.slice(0, _.lastIndexOf(url, '/') + 1);
    }

    function parseManifest(xml) {
        var data = x2js.xml2js(xml),
            manifest = {
                duration: parseDuration(data.MPD._mediaPresentationDuration)
            };

        _.each(data.MPD.Period.AdaptationSet, function (el) {
            var res = {
                mimeType: el._mimeType,
                codecs: el._codecs,
                resolutions: el.Representation
            };
            if (el._mimeType.indexOf('video') > -1) {
                manifest.video = res;
            } else if (el._mimeType.indexOf('audio') > -1) {
                manifest.audio = res;
            }
        });

        manifest.formattedResolutions = getResolutions(manifest.video.resolutions);

        return manifest;
    }

    function parseDuration(str) {
        var seconds = 0, parts;
        durationRegExp.lastIndex = 0;
        parts = durationRegExp.exec(str);

        seconds += isFinite(parts[1]) ? +parts[1] * 60 * 60 : 0;
        seconds += isFinite(parts[2]) ? +parts[2] * 60 : 0;
        seconds += isFinite(parts[3]) ? +parts[3] : 0;
        return seconds;
    }

    function getSegmentCount(duration, segmentTemplate) {
        return Math.round(duration / getSegmentLength(segmentTemplate));
    }

    function getSegmentLoadTime (segmentTemplate) {
        return segmentTemplate._duration / segmentTemplate._timescale * 0.7 * 1000;
    }

    function getSegmentLength(segmentTemplate){
        return segmentTemplate._duration / segmentTemplate._timescale;
    }

    function getSegmentNumber(currentTime, segmentTemplate) {
        return Math.floor(currentTime / getSegmentLength(segmentTemplate));
    }

    function getResolutions(resolutions) {
        return _.chain(resolutions).sort('_bandwidth').map(function(resolution, index) {
            return {
                bandwidth: resolution._bandwidth,
                height: resolution._height,
                width: resolution._width,
                level: index
            };
        }).value();
    }

    function sourceOpen() {
        XhrService.fetchMpd(src).then(function(data) {
            manifest = parseManifest(data);
            mediaSource.duration = manifest.duration;

            _.each(callbacks, function(func) {
                func(manifest.formattedResolutions);
            });

            buffers = {};

            buffers.video = {
                buffer: addBuffer(manifest.video.mimeType + '; codecs=' + manifest.video.codecs,
                    manifest.video.resolutions[0].SegmentTemplate, manifest.duration),
                nextTemplate: null,
                currentTemplate: manifest.video.resolutions[0].SegmentTemplate
            };

            buffers.audio = {
                buffer: addBuffer(manifest.audio.mimeType + '; codecs=' + manifest.audio.codecs,
                    manifest.audio.resolutions.SegmentTemplate, manifest.duration),
                currentTemplate: manifest.audio.resolutions.SegmentTemplate
            };
        });


    }

    function addBuffer(type, segmentTempl, duration) {
        var segmentCount = getSegmentCount(duration, segmentTempl);
        var buffer = mediaSource.addSourceBuffer(type);
        XhrService.fetchData(getBaseUrl(src) + segmentTempl._initialization).then(function(data) {
            buffer.appendBuffer(data);
            updateBuffer(getBaseUrl(src), segmentTempl,
                buffer, +segmentTempl._startNumber, segmentCount);
        });
        return buffer;
    }

    function updateBuffer(baseUrl, segmentTemplate, buffer, number, segmentCount) {
        if (mediaSource.readyState === 'closed') {
            return;
        }
        if (buffers.video.nextTemplate && buffers.video.buffer === buffer) {
            video.pause();
            var template = buffers.video.nextTemplate;

            XhrService.fetchData(getBaseUrl(src) + template._initialization).then(function(data) {
                buffer.appendBuffer(data);
                video.play();
                updateBuffer(getBaseUrl(src), template, buffer, number, segmentCount);
            });
            buffers.video.nextTemplate = null;
            buffers.video.currentTemplate = template;
            return;
        }

        _.each(['video', 'audio'], function(type) {
            if (buffers[type].buffer === buffer && buffers[type].nextNumber) {
                number = buffers[type].nextNumber;
                buffers[type].nextNumber = null;
            }
        });

        XhrService.fetchData(baseUrl + segmentTemplate._media.replace('$Number$', number)).then(function(data) {
            buffer.appendBuffer(data);
            number += 1;
            if( number < segmentCount ) {
                setTimeout(function() {
                    updateBuffer(baseUrl, segmentTemplate, buffer, number, segmentCount);
                }, getSegmentLoadTime(segmentTemplate));
            }
        });
    }

    function updateNextTemplate(level) {
        var formattedResolution = _.find(manifest.formattedResolutions, {level: level}),
            resolution = _.find(manifest.video.resolutions, {_bandwidth: formattedResolution.bandwidth });
        buffers.video.nextTemplate = resolution.SegmentTemplate;
    }

    function seekBuffer() {
        var currentTime = video.currentTime;
        video.pause();

        _.each(['video', 'audio'], function(type) {
            buffers[type].nextNumber = getSegmentNumber(currentTime, buffers[type].currentTemplate);
        });
    }

    function playVideo() {
        video.play();
    }

    function init(_video) {
        video = _video;
        mediaSource = new MediaSource();

        video.addEventListener('canplay', playVideo);

        video.addEventListener('seeking', seekBuffer);
    }

    function loadMedia(_src) {
        if (!mediaSource) {
            return;
        }

        src = _src;
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', sourceOpen);
    }

    function destroy() {
        video.removeEventListener('canplay', playVideo);
        video.removeEventListener('seeking', seekBuffer);
    }

    return {
        loadMedia: loadMedia,
        onResolutionsLoaded: function (func) {
            callbacks.push(func);
        },
        setResolution: updateNextTemplate,
        init: init,
        destroy: destroy
    };
};