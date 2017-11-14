var SpriteHelper = require('SpriteHelper');

cc.Class({
  'extends': cc.Component,

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
    this.scheduleOnce((function () {
      this._disappearUserInfo();
    }).bind(this), 5);

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