var _ = require('lodash');

module.exports = function ClipsService($http, serverBaseUrl, clipsPath) {
  var absoluteClipsPath = serverBaseUrl + clipsPath;

  return {
    getList: function () {
      return $http.get(absoluteClipsPath).then(function (res) {
        return _.map(res.data.clips, function (el) {
          if (!el.absPath &&  el.path) {
            el.absPath = serverBaseUrl + el.path;
          }
          
          if (!el.absThumbnailPath) {
            el.absThumbnailPath = serverBaseUrl + el.thumbnail;
          }

          return el;
        });
      });
    }
  }
};
