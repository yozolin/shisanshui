(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/select.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e913aIwAtVEo5jMrf40D5rw', 'select', __filename);
// scripts/select.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: cc.Node, //选择框
        selectedNode: cc.Node, //对号
        pai: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        //console.log(this.node);
        this.selected = true;
        //console.log(cc.set);
    },

    clickAction: function clickAction() {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
    },

    setSelected: function setSelected(selected) {
        this.selected = selected;
        this.selectedNode.active = this.selected;
    },
    /*#####*/
    clickSelectKuang: function clickSelectKuang() {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
        cc.from.isUseMa = this.selected;
        var mapaiCom = this.pai.getComponent(cc.Button);
        if (this.selectedNode.active === false) {
            mapaiCom.interactable = false;
        } else {
            mapaiCom.interactable = true;
        }
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
        //# sourceMappingURL=select.js.map
        