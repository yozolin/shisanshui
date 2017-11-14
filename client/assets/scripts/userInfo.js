const AudioManager = require('AudioManager');
const Playback = require('Playback');

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
        beilv:cc.Label,
        shootNodes: [cc.Node],
        bankerNode: cc.Node,
        fangZhuNode: cc.Node,
        qingli:cc.Node,
        id:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
      this.updateScore();
    },

    setqingli :function(visible = false){
      this.qingli.active = (visible != false);
    },

    setReadyNodeVisible: function (visible = false) {
      this.readyNode.active = (visible != false);
    },
    setBeilvLabel :function(bl){
      //this.beilv.active = true;
      this.beilv.string = bl?bl+"倍":'';
    },

    setFangZhuNodeVisible: function (visible = false) {
        this.fangZhuNode.active = (visible != false);
    },

    updateScore: function (score = 0) {
        if(score >= 0) {
            this.labelScore.string = "+" + score;
        }
        else {
            this.labelScore.string = ""+score;
        }
    },
    updateUserId:function(id){
      this.id.string = id ? ("ID:"+id):"";
    },
    updateNickname: function(nickname = "") {
      this.labelNickname.string = nickname;
    },

    updateAvatar: function (avatar) {
      if (avatar.endsWith("png")
      || avatar.endsWith("jpg")
      || avatar.endsWith("gif")) {

      } else {
        //avatar = avatar + ".png";
      }

      cc.loader.load({url:avatar,type:"jpg"}, function (err, data) {
        if (err) {
          return;
        }

        var frame = new cc.SpriteFrame(data);
        this.spriteAvatar.spriteFrame = frame;
      }.bind(this));
    },

    setOfflineVisible: function (visible = false) {
      if (Playback.instance.isPlaybacking()) {
        // 如果是处理回放状态，就不用再处理离线消息了
        return;
      }

      this.spriteOffline.node.active = visible;
    },

    setIsBanker: function(isBanker = false) {
      this.bankerNode.active = isBanker;
    },

    playShootAnimation: function (toIndex = 0) {
      //let shootNode = this.shootNodes[toIndex];
      //shootNode.active = true;
      //let anim = shootNode.getComponent(cc.Animation);
      //anim.play('shoot').on('finished', function () {
      //  shootNode.active = false;
      //}, this);

      AudioManager.instance.playDaQiang();
    },

    playBulletHoleAnimation: function () {
      let bulletHoleNode = this.node.getChildByName('bulletHole');
      bulletHoleNode.active = true;
      let anim = bulletHoleNode.getComponent(cc.Animation);
      anim.play('bulletHole').on('finished', function () {
        bulletHoleNode.active = false;
      }, this);
    },

    playSpeakAnimation: function () {
      this.voiceNode.active = true;
      this.scheduleOnce(function () {
        this.voiceNode.active = false;
      }.bind(this), 4);
    },

    // 播放全垒打动画
    playHomeRunAimation: function () {
      //let alert = this.homeRunNode.getComponent('alert');
      //alert.alert();
      //this.scheduleOnce(function () {
      //  this.homeRunNode.active = false;
      //}.bind(this), 2);
    },
});
