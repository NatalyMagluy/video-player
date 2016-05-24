module.exports = function XhrService($q) {
    return {
        getFileLength: function(url) {
            var xhr = new XMLHttpRequest();
            var defer = $q.defer();
            xhr.open('head', url);
            xhr.onload = function () {
                defer.resolve(xhr.getResponseHeader('content-length'));
            };
            xhr.send();
            return defer.promise;
        },
        fetchData: function(url) {
            var xhr = new XMLHttpRequest();
            var defer = $q.defer();
            xhr.open('get', url);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                defer.resolve(xhr.response);
            };
            xhr.send();
            return defer.promise;
        },
        fetchRange: function(url, start, end) {
            var xhr = new XMLHttpRequest();
            var defer = $q.defer();
            xhr.open('get', url);
            xhr.responseType = 'arraybuffer';
            xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);
            xhr.onload = function () {
                console.log('fetched bytes: ', start, end);
                defer.resolve({chunk: xhr.response, addBytes: end - start + 1});
            };
            xhr.send();
            return defer.promise;
        },
        fetchMpd: function(url) {
            var xhr = new XMLHttpRequest();
            var defer = $q.defer();
            xhr.open('get', url);
            xhr.responseType = ' text/plain';
            xhr.onload = function () {
                defer.resolve(xhr.response);
            };
            xhr.send();
            return defer.promise;
        }

    };
};
