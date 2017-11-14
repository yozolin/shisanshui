var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var KQNativeInvoke = require('KQNativeInvoke');

var KQGlabolSocketEventHander = {
    start: function start() {
        if (this._didStart) {
            return;
        }
        this._didStart = true;

        KQGlobalEvent.on(Socket.Event.ReceiveForceExit, this._forceExitApp, this);
    },

    _forceExitApp: function _forceExitApp(response) {
        KQNativeInvoke.forceExitApp();
    }
};

module.exports = KQGlabolSocketEventHander;