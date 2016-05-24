module.exports = function MainController(ClipsService) {
    'use strict';
    var vm = this;
    vm.clips = null;
    ClipsService.getList().then(function(data) {
        vm.clips = data;
    });
};