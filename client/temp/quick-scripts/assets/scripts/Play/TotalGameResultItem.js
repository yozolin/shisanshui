(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Play/TotalGameResultItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e1c6f93a1BOnoSiX6kJ0Efn', 'TotalGameResultItem', __filename);
// scripts/Play/TotalGameResultItem.js

"use strict";

var SpriteHelper = require('SpriteHelper');
cc.Class({
  extends: cc.Component,

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
        //# sourceMappingURL=TotalGameResultItem.js.map
        