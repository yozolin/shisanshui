"use strict";
cc._RFpush(module, 'e1c6f93a1BOnoSiX6kJ0Efn', 'TotalGameResultItem');
// scripts\Play\TotalGameResultItem.js

var SpriteHelper = require('SpriteHelper');
cc.Class({
  "extends": cc.Component,

  properties: {
    avatarSprite: cc.Sprite,
    labelUserId: cc.Label,
    labelScore: cc.Label,
    labelNickname: cc.Label,

    _deskInfo: null
  },

  // use this for initialization
  onLoad: function onLoad() {},

  setUserInfo: function setUserInfo(user, deskInfo) {
    if (!user) {
      return;
    }

    var totalScore = user.totalScore;
    if (deskInfo && (deskInfo.setting1 == 0 || deskInfo.setting1 == 1)) {
      var baseScore = deskInfo.setting1 == 0 ? 100 : 200;
      totalScore = totalScore - baseScore;
    }

    SpriteHelper.setImageUrl(this.avatarSprite, user.avatarUrl);
    this.labelUserId.string = "" + user.id;
    this.labelScore.string = totalScore > 0 ? "+ " + totalScore : "- " + totalScore * -1;
    if (totalScore == 0) {
      this.labelScore.string = "0";
    }
    this.labelNickname.string = user.nickname;
  }
});

cc._RFpop();