(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/select_ma.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4bc0b2bZGRGXoAfdO3Y6Squ', 'select_ma', __filename);
// scripts/select_ma.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        rightIcon: [cc.Node],
        mapaiRight: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.from == null) {
            cc.from = {};
        }
        //如果不带马，则马牌为空
        if (this.mapaiRight.active == false) {
            cc.from.isUseMa = false;
            cc.from.ma = null;
        } else {
            cc.from.isUseMa = true;
            //否则马牌默认为第0个，即黑桃5
            cc.from.ma = 0;
        }
        for (var i = 0; i < this.rightIcon.length; i++) {
            if (i == 0) {
                this.rightIcon[i].active = true;
                cc.from.ma = 0;
                this.select = this.rightIcon[i];
            } else {
                this.rightIcon[i].active = false;
            }
        }
    },
    onMaPaiClick: function onMaPaiClick(e) {
        var targetName = e.target.name;
        //cc.log(targetName)
        if (targetName != this.select.parent.name) {
            if (targetName == "select_kuang1") {
                this.select = this.rightIcon[2];
                cc.from.ma = 2;
            } else if (targetName == "select_kuang2") {
                this.select = this.rightIcon[1];
                cc.from.ma = 1;
            } else if (targetName == "select_kuang3") {
                this.select = this.rightIcon[0];
                cc.from.ma = 0;
            }
            for (var i = 0; i < this.rightIcon.length; i++) {
                this.rightIcon[i].active = false;
            }
            this.select.active = true;
        }
        //console.log(cc.from.ma);
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
        //# sourceMappingURL=select_ma.js.map
        