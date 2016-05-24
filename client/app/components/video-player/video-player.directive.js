var template = require('./video-player.html');
var controller = require('./video-player.controller');
require('./video-player.scss');

module.exports = function playerDirective() {
    return {
        template: template,
        link: function (scope, element, attrs, ctrl) {
            ctrl.init(element.find('video')[0]);
        },
        controller: controller,
        controllerAs: 'player',
        bindToController: {
            clips: '='
        }
    }
};
