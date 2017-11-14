(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/userInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e8d10xRGnJAn42wJsuC6aBi', 'userInfo', __filename);
// scripts/userInfo.js

'use strict';

var AudioManager = require('AudioManager');
var Playback = require('Playback');

cc.Class({
  extends: cc.Component,

  properties: {
    spriteAvatar: cc.Sprite,
    labelNickname: cc.Label,
    labelScore: cc.Label,
    spriteOffline: cc.Sprite,
    voiceNode: cc.Node,
    homeRunNode: cc.Node,
    readyNode: cc.Node,
    beilv: cc.Label,
    shootNodes: [cc.Node],
    bankerNode: cc.Node,
    fangZhuNode: cc.Node,
    qingli: cc.Node,
    id: cc.Label
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.updateScore();
  },

  setqingli: function setqingli() {
    var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    this.qingli.active = visible != false;
  },

  setReadyNodeVisible: function setReadyNodeVisible() {
    var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    this.readyNode.active = visible != false;
  },
  setBeilvLabel: function setBeilvLabel(bl) {
    //this.beilv.active = true;
    this.beilv.string = bl ? bl + "倍" : '';
  },

  setFangZhuNodeVisible: function setFangZhuNodeVisible() {
    var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    this.fangZhuNode.active = visible != false;
  },

  updateScore: function updateScore() {
    var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (score >= 0) {
      this.labelScore.string = "+" + score;
    } else {
      this.labelScore.string = "" + score;
    }
  },
  updateUserId: function updateUserId(id) {
    this.id.string = id ? "ID:" + id : "";
  },
  updateNickname: function updateNickname() {
    var nickname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    this.labelNickname.string = nickname;
  },

  updateAvatar: function updateAvatar(avatar) {
    if (avatar.endsWith("png") || avatar.endsWith("jpg") || avatar.endsWith("gif")) {} else {
      //avatar = avatar + ".png";
    }

    cc.loader.load({ url: avatar, type: "jpg" }, function (err, data) {
      if (err) {
        return;
      }

      var frame = new cc.SpriteFrame(data);
      this.spriteAvatar.spriteFrame = frame;
    }.bind(this));
  },

  setOfflineVisible: function setOfflineVisible() {
    var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (Playback.instance.isPlaybacking()) {
      // 如果是处理回放状态，就不用再处理离线消息了
      return;
    }

    this.spriteOffline.node.active = visible;
  },

  setIsBanker: function setIsBanker() {
    var isBanker = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    this.bankerNode.active = isBanker;
  },

  playShootAnimation: function playShootAnimation() {
    var toIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    //let shootNode = this.shootNodes[toIndex];
    //shootNode.active = true;
    //let anim = shootNode.getComponent(cc.Animation);
    //anim.play('shoot').on('finished', function () {
    //  shootNode.active = false;
    //}, this);

    AudioManager.instance.playDaQiang();
  },

  playBulletHoleAnimation: function playBulletHoleAnimation() {
    var bulletHoleNode = this.node.getChildByName('bulletHole');
    bulletHoleNode.active = true;
    var anim = bulletHoleNode.getComponent(cc.Animation);
    anim.play('bulletHole').on('finished', function () {
      bulletHoleNode.active = false;
    }, this);
  },

  playSpeakAnimation: function playSpeakAnimation() {
    this.voiceNode.active = true;
    this.scheduleOnce(function () {
      this.voiceNode.active = false;
    }.bind(this), 4);
  },

  // 播放全垒打动画
  playHomeRunAimation: function playHomeRunAimation() {
    //let alert = this.homeRunNode.getComponent('alert');
    //alert.alert();
    //this.scheduleOnce(function () {
    //  this.homeRunNode.active = false;
    //}.bind(this), 2);
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
        //# sourceMappingURL=userInfo.js.map
        