var manager = require('manager');

let AudioManager = cc.Class({
    extends: cc.Component,

    properties: {
        hall_bgm: {
            default: null,
            url: cc.AudioClip
        },

        game_bgm: {
            default: null,
            url: cc.AudioClip
        },

        compare_bgm: {
            default: null,
            url: cc.AudioClip
        },

        // 打枪
        daQiang: {
          default: null,
          url: cc.AudioClip
        },

        buttonClick: {
          default: null,
          url: cc.AudioClip
        },

        fapai: {
            default: null,
            url: cc.AudioClip
        },
    },

    statics: {
      instance: null,
    },

    onLoad:function() {
      AudioManager.instance = this;
      this._registerAppActiveChange();

        this.soundOn = true;
        cc.game.addPersistRootNode(this.node);
        if (cc.game.isPersistRootNode(this.node)) {
            cc.log('添加全局节点成功');
        }
        this.mValue = manager.getMusicValue();
        this.mEValue = manager.getMusicEffectValue();
        this.bgAudioId = -1;
    },

    playMusic: function() {
        this.bgAudioId = cc.audioEngine.playMusic( this.hall_bgm, true);
        if (this.bgAudioId != -1) {
            cc.log('play');
            cc.audioEngine.setVolume(this.bgAudioId,this.mValue);
        }
        //cc.audioEngine.playMusic( url, true )
    },

    playDeskMusic: function() {
        this.bgAudioId = cc.audioEngine.playMusic( this.game_bgm, true);
        if (this.bgAudioId != -1) {
            cc.audioEngine.setVolume(this.bgAudioId,this.mValue);
        }
    },

    playCompareCardsMusic: function () {
      this.bgAudioId = cc.audioEngine.playMusic( this.compare_bgm, true);
      if (this.bgAudioId != -1) {
        cc.audioEngine.setVolume(this.bgAudioId,this.mValue);
      }
    },

    playDaQiang: function () {
      for (var start = 0; start <= 1.6; start = start + 0.5) {
        this.scheduleOnce(function () {
          this._playSFX(this.daQiang);
        }.bind(this), start);
      }
    },

    // “打枪”
    playHumanDaQiang: function (sex = 1) {
      var path = "resources/sounds/" + (sex == 1 ? "man" : "woman");
      path = path + "/daqiang1.wav";

      let url = cc.url.raw(path);
      this._playSFX(url);
    },

    playPokerClick: function () {
      let url = cc.url.raw('resources/sounds/public/poker_click.wav');
      this._playSFX(url);
    },

    // 播放全垒打音效
    playHomeRun: function (sex = 1) {
      let path = this._soundsHumanPath(sex) + "special1.wav";
      let url = cc.url.raw(path);
      this._playSFX(url);
    },

    // 播放发牌音效
    playFaPai: function() {
        this._playSFX(this.fapai);
        for (let index = 0; index < 6; index++) {
            this.scheduleOnce(function() {
                this._playSFX(this.fapai);
            }.bind(this), index * 0.1);
        }
    },

    playCardType: function (sex = 1, type = -1) {
      // 只播放普通类型的语音
      if ((type >= 10) || (type < 0)) {
        // 10 及以上是特殊牌
        return;
      }

      let path = this._soundsHumanPath(sex) + "common" + (type + 1) + ".wav";
      let url = cc.url.raw(path);
      this._playSFX(url);
    },

    // 播放 开始比牌
    playStartCompare: function (sex = 1) {
      let path = this._soundsHumanPath(sex) + "start_compare.wav";
      let url = cc.url.raw(path);
      this._playSFX(url);
    },

    playWin: function () {
      let url = cc.url.raw('resources/sounds/openface/win.wav');
      this._playSFX(url);
    },

    playLose: function () {
      let url = cc.url.raw('resources/sounds/openface/lose.wav');
      this._playSFX(url);
    },

    _soundsHumanPath: function (sex) {
      let path = "resources/sounds/" + (sex == 1 ? "man" : "woman") + "/";
      return path;
    },

    setBgMusicVolumn: function(value) {
        this.mValue = value;
        if (this.bgAudioId != -1) {
          cc.audioEngine.setVolume(this.bgAudioId,value);
        }
    },

    setEffectMusicVolum: function(value) {
        this.mEValue = value;
    },

    /*聊天*/
    playChatAudio:function(sex, str) {
      let index = this.chatTexts().indexOf(str);
      if (index === -1) {
        return;
      }

        let number = ((sex == 1) ? 1000 : 2000) + index;
        let path = "resources/sounds/chat/" + number + ".wav";
        let url = cc.url.raw(path);
        this._playSFX(url);
    },

    /*'很高兴和你们一起打牌！',
        '快点儿吧，我等得花儿都谢了~！',
        '急什么，让我想想怎么打！',
        '这牌真好，全垒打有希望啊！',
        '我是一个神枪手，打抢本领大！',
        '这把牌敢不敢再水一点啊！',
        '又输啦！大爷给条活路吧！',
        '你是妹妹 还是哥哥啊',
        '交个朋友吧。。',
        '我有事先走了，下次再玩吧！',
        '再见了 我会想念大家的，，',
        '怎么又断线了  网络怎么这么差啊，，'
    */
    chatTexts: function () {
      return [
        '不要吵了，专心玩游戏吧！',
        '大家不要走，决战到天亮~！',
        '大家好，很高兴见到各位！',
        '各位不好意思，我离开一会！',
        '和你合作真是太愉快了！',
        '快点儿啊，都等得我花都谢了！',
        '你的牌打得太好了！',
        '你是妹妹 还是哥哥啊',
        '交个朋友吧。。',
        '我有事先走了，下次再玩吧！',
        '再见了 我会想念大家的，，',
        '怎么又断线了  网络怎么这么差啊，，'
      ];
    },

    pauseMusic: function() {
        this.soundOn = false;
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function() {
        this.soundOn = true;
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function(clip) {
        if (this.soundOn) {
            var audioId = cc.audioEngine.playEffect( clip, false );
            cc.audioEngine.setVolume(audioId,this.mEValue);
            return audioId;
        }

        return null;
    },

     // MARK: 前后台操作
    _registerAppActiveChange: function () {
        cc.game.on(cc.game.EVENT_HIDE, this._appEnterBackground, this);
        cc.game.on(cc.game.EVENT_SHOW, this._appBecomActive, this);
    },

    /**
      * 进入后台
      */
    _appEnterBackground: function () {
        let now = cc.sys.now();
        if (now - this._lastAppEnterBackgroundTime < 100) {
            return;
        }
        this._lastAppEnterBackgroundTime = now;

        this.pauseMusic();
    },

  /**
   * 进入前台 
   */
  _appBecomActive: function () {
    let now = cc.sys.now();
    if (now - this._lastAppBecomActiveTime < 100) {
      return;
    }
    this._lastAppBecomActiveTime = now;

    this.resumeMusic();
  },

});

module.exports = AudioManager;
