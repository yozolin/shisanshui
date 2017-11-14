"use strict";
cc._RFpush(module, '98986IsXIdHiqLGEVIG2CWP', 'cardsBack');
// scripts\cardsBack.js

// 牌背影列表 component
// 可以显示、隐藏牌背影列表
cc.Class({
  "extends": cc.Component,

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
    this.cardsBackList.forEach((function (cardBack) {
      this.scheduleOnce(function () {
        cardBack.node.active = true;
      }, startTime);
      startTime = startTime + interval;
    }).bind(this));
  },

  // 隐藏显示牌背影
  hideCardBacks: function hideCardBacks() {
    this.cardsBackLayout.node.active = false;
    this.cardsBackList.forEach(function (cardBack) {
      cardBack.node.active = false;
    });
  }
});

cc._RFpop();