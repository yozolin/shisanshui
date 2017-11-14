(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Socket/KQGlabolSocketEventHander.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'babea3CWj9G1pWM9AkXao0n', 'KQGlabolSocketEventHander', __filename);
// scripts/Socket/KQGlabolSocketEventHander.js

'use strict';

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

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=KQGlabolSocketEventHander.js.map
        