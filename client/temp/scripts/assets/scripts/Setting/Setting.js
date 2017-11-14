"use strict";
cc._RFpush(module, 'f3ad6mNk4BMBZzipGQDNlr4', 'Setting');
// scripts\Setting\Setting.js

var Manager = require('manager');
var KQNativeInvoke = require('KQNativeInvoke');

cc.Class({
  'extends': cc.Component,

  properties: {
    phone: cc.Label,
    musicSlider: cc.Node,
    effectSlider: cc.Node,
    btnSwitchAccount: cc.Button,
    shareBg: cc.Node,
    wx: cc.Node,
    pyq: cc.Node,
    music: cc.Node,
    sounds: cc.Node,
    _audioManager: null,
    _musicOn: 1,
    _soundsOn: 1,
    _phone: null
  },

  // use this for initialization
  onLoad: function onLoad() {
    this._audioManager = cc.find('AudioManager') || {};
    this._audioManager = this._audioManager.getComponent('AudioManager');
    this._initSliders();
    this.phone.string = this._phone ? this._phone : "无";
    var bgMusic = cc.sys.localStorage.getItem("bgMusic");
    var bgSound = cc.sys.localStorage.getItem("bgSound");
    //console.log(bgMusic);
    if (bgMusic != '') {
      if (parseInt(bgMusic) == 1) {
        this._musicOn = 1;
        this.music.getChildByName('music_on').active = true;
        this.music.getChildByName('music_off').active = false;
      } else {
        this._musicOn = 0;
        this.music.getChildByName('music_on').active = false;
        this.music.getChildByName('music_off').active = true;
      }
    }
    if (bgSound == 0) {
      // 如果背景音效是关闭的
      if (parseInt(bgSound) == 0) {
        this._soundsOn = 0;
        this.sounds.getChildByName('sounds_on').active = false;
        this.sounds.getChildByName('sounds_off').active = true;
      } else {
        this._soundsOn = 1;
        this.sounds.getChildByName('sounds_on').active = true;
        this.sounds.getChildByName('sounds_off').active = false;
      }
      this._audioManager.setEffectMusicVolum(this._soundsOn);
    }
  },
  clickWx: function clickWx() {
    //点击微信
    if (!cc.sys.isNative) {
      this.shareBg.active = true;
      this.wx.active = true;
    } else {
      var title = cc.sys.localStorage.getItem('shareTitle');
      var description = cc.sys.localStorage.getItem('desc');
      var recordId = cc.sys.localStorage.getItem('recordId');
      var roomId = cc.sys.localStorage.getItem('roomId');
      var id = '';
      if (roomId) {
        id = 'roomId=' + roomId;
      }
      if (recordId) {
        id = 'recordId=' + recordId;
      }
      if (KQNativeInvoke.isNativeIOS()) {
        jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend:description:", id, description, title);
      } else if (KQNativeInvoke.isNativeAndroid()) {
        //Android
        var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", str, id, description, title);
      }
    }
  },
  clickPyq: function clickPyq() {
    //点击朋友圈
    if (!cc.sys.isNative) {
      this.shareBg.active = true;
      this.pyq.active = true;
    } else {
      var title = cc.sys.localStorage.getItem('shareTitle');
      var description = cc.sys.localStorage.getItem('desc');
      var recordId = cc.sys.localStorage.getItem('recordId');
      var roomId = cc.sys.localStorage.getItem('roomId');
      var id = '';
      if (roomId) {
        id = 'roomId=' + roomId;
      }
      if (recordId) {
        id = 'recordId=' + recordId;
      }
      if (KQNativeInvoke.isNativeIOS()) {
        jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallTimeline:description:", id, description, title);
      } else if (KQNativeInvoke.isNativeAndroid()) {
        //Android
        var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallTimeline", str, id, description, title);
      }
    }
  },

  clickshareBg: function clickshareBg() {
    // 点击分享背景图
    this.shareBg.active = false;
    this.wx.active = false;
    this.pyq.active = false;
  },
  clickMusic: function clickMusic() {
    //点击音乐
    this.music.children[1].active = this._musicOn = !this._musicOn;
    this.music.children[2].active = !this._musicOn;
    var volume = 0;
    if (this._musicOn) {
      this._audioManager.setBgMusicVolumn(1);
      this._audioManager.playMusic();
      volume = 1;
    } else {
      this._audioManager.setBgMusicVolumn(0);
      volume = 0;
    }
    cc.sys.localStorage.setItem("bgMusic", volume);
  },

  clickSounds: function clickSounds() {
    //点击了音效
    this.sounds.children[1].active = this._soundsOn = !this._soundsOn;
    this.sounds.children[2].active = !this._soundsOn;
    var volume = 0;
    if (this._soundsOn) {
      this._audioManager.setEffectMusicVolum(1);
      volume = 1;
    } else {
      this._audioManager.setEffectMusicVolum(0);
      volume = 0;
    }
    cc.sys.localStorage.setItem("bgSound", volume);
  },
  clickSetting: function clickSetting() {//点击设置

  },
  _initSliders: function _initSliders() {
    this._initSliderEvents();

    var musicVal = Manager.getMusicValue();
    var effectVal = Manager.getMusicEffectValue();

    this._audioManager.setBgMusicVolumn(musicVal);
    this._audioManager.setEffectMusicVolum(effectVal);

    this.musicSlider.getComponent('slider').setValue(musicVal);
    this.effectSlider.getComponent('slider').setValue(effectVal);
  },

  _initSliderEvents: function _initSliderEvents() {
    var self = this;
    this.musicSlider.getComponent('slider').onValueChange = function (value) {
      Manager.setMusicValue(value);
      self._audioManager.setBgMusicVolumn(value);
    };

    this.effectSlider.getComponent('slider').onValueChange = function (value) {
      Manager.setMusicEffectValue(value);
      self._audioManager.setEffectMusicVolum(value);
    };
  },

  clickSwitch: function clickSwitch() {},

  hideSwitch: function hideSwitch() {
    if (this.btnSwitchAccount) {
      this.btnSwitchAccount.node.active = false;
    }
  }
});

cc._RFpop();