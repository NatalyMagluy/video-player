var template = require('./video-player.html');
var controller = require('./video-player.controller');
require('./video-player.scss');

module.exports = function playerDirective() {
    return {
        template: template,
        controller: controller,
        controllerAs: 'player'
    }
};
