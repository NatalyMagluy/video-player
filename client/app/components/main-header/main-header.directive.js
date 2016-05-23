var template = require('./main-header.html');
require('./main-header.scss');

module.exports = function videoSeek() {
    'use strict';

    return {
        restrict: 'E',
        template: template
    };
};
