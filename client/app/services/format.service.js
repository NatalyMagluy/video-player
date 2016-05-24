module.exports = function FormatService() {
    function level2label(level) {
        if (level.name) {
            return level.name;
        } else if (level.height) {
            return (level.height + 'p');
        } else if (level.bitrate) {
            return (Math.round(level.bitrate / 1024) + 'kb');
        }
        return null;
    }

    function parseLevels(levels) {
        return _.map(levels, function (level, index) {
            return {
                level: index,
                label: level2label(level)
            };
        });
    }

    function normalizeTimePart(timePart) {
        return timePart < 10 ? "0" + timePart : timePart;
    }

    function parseDuration(totalSeconds) {
        var hours = parseInt(totalSeconds / 3600) % 24,
            minutes = parseInt(totalSeconds / 60) % 60,
            seconds = Math.floor(totalSeconds % 60);

        return [
            normalizeTimePart(hours),
            normalizeTimePart(minutes),
            normalizeTimePart(seconds)
        ].join(':');
    }

    return {
        level2label: level2label,
        parseLevels: parseLevels,
        normalizeTimePart: normalizeTimePart,
        parseDuration: parseDuration
    };
};