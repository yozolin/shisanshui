(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/agreement.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8f601dzNnZLtq+KGT0uqDqF', 'agreement', __filename);
// scripts/agreement.js

'use strict';

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var KQGlabolSocketEventHander = require('KQGlabolSocketEventHander');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        agreement: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        KQGlobalEvent.on(Socket.Event.ReceiveHallInfo, this._socketReceiveHallInfo, this);
        // cc.log('----61')
        //  cc.log(this.agreement)
    },
    _socketReceiveHallInfo: function _socketReceiveHallInfo(response) {
        if (!response.result) {
            return;
        }
        var s = cc.find('Canvas/agreement');
        var data = response.data;
        //this._info1 = response.data;
        // cc.log(this.agreement)
        // cc.log(s)
        // cc.log('----61')
        this.agreement.string = data.info1 || "";
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

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
        //# sourceMappingURL=agreement.js.map
        