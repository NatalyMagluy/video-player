var appModule = require('./../index');

module.exports = function(){
    appModule.constant('serverBaseUrl', 'http://localhost:3000/');
    appModule.constant('clipsPath', 'video/clips.json');
};
