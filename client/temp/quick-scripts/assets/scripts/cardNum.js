(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/cardNum.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '19329zUw3hCTpBk+7waBT2d', 'cardNum', __filename);
// scripts/cardNum.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {

        cards: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.totalCards();
    },
    totalCards: function totalCards() {
        // var create = this.node.children;
        //console.log(this.node);
        var renshu = this.node.getChildByName("renshu");
        var jushu = this.node.getChildByName("jushu");
        var getCard = this.node.getChildByName("cards");
        //var renshu = create[3], jushu = create[4], getCard = create[6];

        var rs = renshu.getComponent("singleSelect").selectedIndex;
        var js = jushu.getComponent("singleSelect").selectedIndex;
        var gc = getCard.getComponent("singleSelect").selectedIndex;

        var R = 1,
            J = 1,
            G = 1;
        switch (rs) {
            case 0:
                R = 1;break;
            case 1:
                R = 2;break;
            case 2:
                R = 3;break;
            case 3:
                R = 4;break;
        }
        switch (js) {
            case 0:
                J = 1;break;
            case 1:
                J = 2;break;
            case 2:
                J = 3;break;
        }
        switch (gc) {
            case 0:
                G = 1;break; // AA制
            default:
                G = 0;break;
        }
        this.cards.string = R + J;
        //this.cards.string = G ? (R+J):(R+J)*(R+3);  // (R+J)表示每个人要出的房卡量；(R+3)表示一共有多少人，    
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
        //# sourceMappingURL=cardNum.js.map
        