(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Pefabs/ChatTextRecord.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '88d10U9tIpHNK1entoUH0Ju', 'ChatTextRecord', __filename);
// scripts/Pefabs/ChatTextRecord.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    setString: function setString(str) {
        this._richText().string = str;
    },

    _richText: function _richText() {
        return this.node.getComponent('cc.RichText');
    },

    setEmoji: function setEmoji(spraite) {
        this._spriteFrame().Spraite = spraite;
    },
    _spriteFrame: function _spriteFrame() {
        return this.node.getComponent('cc.Sprite');
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
        //# sourceMappingURL=ChatTextRecord.js.map
        