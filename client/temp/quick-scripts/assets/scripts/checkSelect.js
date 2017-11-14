(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/checkSelect.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '974a0c6jzZPRI5AeaAb4U0z', 'checkSelect', __filename);
// scripts/checkSelect.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        selectedIndex: 0,
        selectedNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.selected = true;
        this.selectedIndex = 0;
        this.selectedNode.active = true;
    },
    clickAction: function clickAction(e, data) {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
        this.selectedIndex = this.selected ? 0 : null;
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
        //# sourceMappingURL=checkSelect.js.map
        