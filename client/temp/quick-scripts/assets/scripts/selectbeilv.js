(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/selectbeilv.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '253cf+Bll9FV5ngl0DW3PxZ', 'selectbeilv', __filename);
// scripts/selectbeilv.js

'use strict';

var KQGlobalEvent = require('KQGlobalEvent');
var Socket = require('socket');
cc.Class({
    extends: cc.Component,

    properties: {
        _userid: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},
    clickBeiLv: function clickBeiLv(event, num) {
        this.node.active = false;
        Socket.sendBeiLv(num, this._userid);
    }

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
        //# sourceMappingURL=selectbeilv.js.map
        