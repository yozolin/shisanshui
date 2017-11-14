(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/scale.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c1c33tgIe9JvLb/mE+2mRnK', 'scale', __filename);
// scripts/scale.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node
    },

    onLoad: function onLoad() {
        var visibleSize = cc.director.getVisibleSize();
        var contentSize = {};
        contentSize.width = this.node.width;
        contentSize.height = this.node.height;
        var scaleX = visibleSize.width / contentSize.width;
        var scaleY = visibleSize.height / contentSize.height;
        var scale = Math.min(scaleX, scaleY).toFixed(2);
        this.node.scaleX = scale;
        this.node.scaleY = scale;
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
        //# sourceMappingURL=scale.js.map
        