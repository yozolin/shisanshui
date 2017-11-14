(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/cardsBack.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '98986IsXIdHiqLGEVIG2CWP', 'cardsBack', __filename);
// scripts/cardsBack.js

"use strict";

// 牌背影列表 component
// 可以显示、隐藏牌背影列表
cc.Class({
  extends: cc.Component,

  properties: {
    cardsBackLayout: cc.Layout,
    cardsBackList: [cc.Sprite]
  },

  // use this for initialization
  onLoad: function onLoad() {},

  // 以动画的方式显示牌背影
  showPlayCardBacks: function showPlayCardBacks() {
    this.hideCardBacks();
    this.cardsBackLayout.node.active = true;

    var interval = 0.05;
    var startTime = 0;
    this.cardsBackList.forEach(function (cardBack) {
      this.scheduleOnce(function () {
        cardBack.node.active = true;
      }, startTime);
      startTime = startTime + interval;
    }.bind(this));
  },

  // 隐藏显示牌背影
  hideCardBacks: function hideCardBacks() {
    this.cardsBackLayout.node.active = false;
    this.cardsBackList.forEach(function (cardBack) {
      cardBack.node.active = false;
    });
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
        //# sourceMappingURL=cardsBack.js.map
        