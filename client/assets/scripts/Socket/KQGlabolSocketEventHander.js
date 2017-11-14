const Socket = require('socket');
const KQGlobalEvent = require('KQGlobalEvent');
const KQNativeInvoke = require('KQNativeInvoke');

let KQGlabolSocketEventHander = {
    start: function() {
        if (this._didStart) {
            return;
        }
        this._didStart = true;

        KQGlobalEvent.on(Socket.Event.ReceiveForceExit, this._forceExitApp, this);
    },

    _forceExitApp: function(response) {
        KQNativeInvoke.forceExitApp();
    },
};

module.exports = KQGlabolSocketEventHander;