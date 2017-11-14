(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Play/UserSampleInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3a9f7A0IgRGPrAZvy1p9s4i', 'UserSampleInfo', __filename);
// scripts/Play/UserSampleInfo.js

'use strict';

var SpriteHelper = require('SpriteHelper');

cc.Class({
  extends: cc.Component,

  properties: {
    labelUserId: cc.Label,
    labelUserIP: cc.Label,
    labelNickname: cc.Label,
    avatarSprite: cc.Sprite,
    manSprite: cc.Sprite,
    womenSprite: cc.Sprite,

    _didShowUserInfo: null
  },

  // use this for initialization
  onLoad: function onLoad() {},

  updateWithUser: function updateWithUser(user) {
    return;
    if (!user) {
      return;
    }

    if (this._didShowUserInfo == user) {
      this.unscheduleAllCallbacks();
      this._disappearUserInfo();
      return;
    }

    this._didShowUserInfo = user;
    if (!this.node.active) {
      this.node.getComponent('alert').alert();
    }

    this.unscheduleAllCallbacks();
    this.scheduleOnce(function () {
      this._disappearUserInfo();
    }.bind(this), 5);

    this.labelUserId.string = "UID:\n" + user.id;
    this.labelUserIP.string = "用户IP:\n" + user.ipAddress.replace("::ffff:", "");
    this.labelNickname.string = user.nickname;
    this.avatarSprite.spriteFrame = null;
    SpriteHelper.setImageUrl(this.avatarSprite, user.avatarUrl);

    var sex = user.sex; // sex: 1 男  2 女
    this.manSprite.node.active = sex == 1;
    this.womenSprite.node.active = sex != 1;
  },

  _disappearUserInfo: function _disappearUserInfo() {
    this.node.active = false;
    this._didShowUserInfo = null;
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
        //# sourceMappingURL=UserSampleInfo.js.map
        