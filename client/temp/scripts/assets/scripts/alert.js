"use strict";
cc._RFpush(module, '16cd2qs73lByZaHhJkQAEee', 'alert');
// scripts\alert.js

var AudioManager = require('AudioManager');
cc.Class({
  'extends': cc.Component,

  properties: {
    // foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
    popNode: cc.Node,
    label: cc.Label,

    _alertCallback: null,
    _willDismissCallback: null,
    _dismissCallback: null,
    _confirmCallback: null, // 点击确定后的回调
    _tishi: null,
    _card_num: null
  },

  // use this for initialization
  onLoad: function onLoad() {},

  alert: function alert() {
    this.node.active = true;
    var anim = this.popNode.getComponent(cc.Animation);
    anim.play('pop');

    if (this._alertCallback) {
      this._alertCallback(this.node);
    }
  },
  /*#####弹出结果*/
  alertResult: function alertResult() {
    this.node.active = true;
    cc.find("Canvas/show_result").active = false;
    var anim = this.popNode.getComponent(cc.Animation);
    anim.play('pop');

    if (this._alertCallback) {
      this._alertCallback(this.node);
    }
  },

  /*#####点击确定*/
  playBtnClickSFX: function playBtnClickSFX() {
    AudioManager.instance.playBtnClickSFX();
  },

  /*#####点击取消*/
  palyBtnCancelClickSFX: function palyBtnCancelClickSFX() {
    AudioManager.instance.palyBtnCancelClickSFX();
  },

  /*#####点击关闭或者按键之类的按钮，播放音效*/
  palyBtnPublicSFX: function palyBtnPublicSFX() {
    AudioManager.instance.palyBtnPublicSFX();
  },

  /*#####点击创建房间，播放音效*/
  palyBtnCreateRoomSFX: function palyBtnCreateRoomSFX() {
    AudioManager.instance.palyBtnCreateRoomSFX();
  },
  /*#####点击创建房间，播放音效*/
  palyWindowSFX: function palyWindowSFX() {
    AudioManager.instance.palyWindowSFX();
  },

  palyWeiXinLoginSFX: function palyWeiXinLoginSFX() {
    AudioManager.instance.palyWeiXinLoginSFX();
  },
  palyFangPaiSFX: function palyFangPaiSFX() {
    AudioManager.instance.palyFangPaiSFX();
  },

  dismissAction: function dismissAction() {
    var willDismissCallback = this._willDismissCallback;
    if (willDismissCallback) {
      var result = willDismissCallback();
      if (result) {
        this.dismissComplete();
        return;
      }
    }

    var anim = this.popNode.getComponent(cc.Animation);
    var dismissAnim = anim.getAnimationState('pop_dismiss');
    dismissAnim.on('finished', this.dismissComplete, this);
    anim.play('pop_dismiss');
  },

  /*#####隐藏结果页面*/
  dismissActionResult: function dismissActionResult() {
    var willDismissCallback = this._willDismissCallback;
    if (willDismissCallback) {
      var result = willDismissCallback();
      if (result) {
        this.dismissComplete();
        return;
      }
    }

    var anim = this.popNode.getComponent(cc.Animation);
    var dismissAnim = anim.getAnimationState('pop_dismiss');
    dismissAnim.on('finished', this.dismissComplete, this);
    anim.play('pop_dismiss');
    cc.find("Canvas/show_result").active = true;
  },

  dismissComplete: function dismissComplete() {
    this.node.active = false;

    if (this.onDismissComplete) {
      this.onDismissComplete();
    }

    if (this._dismissCallback) {
      this._dismissCallback(this.node);
    }
  },
  dismissPlay: function dismissPlay() {
    cc.director.loadScene("hall");
  },

  onDismissComplete: function onDismissComplete() {
    //cc.log("onDismissComplete");
  },

  doneAction: function doneAction() {
    this.dismissAction();
    this.onDoneAction();

    var confirmCallback = this._confirmCallback;
    if (confirmCallback) {
      confirmCallback(this.node);
    }
  },

  onDoneAction: function onDoneAction() {},

  setMessage: function setMessage(msg) {
    this.label.string = msg;
  },

  getMessage: function getMessage() {
    return this.label.string;
  },

  setAlertCallbck: function setAlertCallbck(callback) {
    this._alertCallback = callback;
  },

  setWillDismissCallback: function setWillDismissCallback(callback) {
    this._willDismissCallback = callback;
  },

  setDismissCallback: function setDismissCallback(callback) {
    this._dismissCallback = callback;
  },

  setConfirmCallback: function setConfirmCallback(callback) {
    this._confirmCallback = callback;
  }

});
/*setMessage: function (message) {
  this.label.getComponent('cc.Label').string = message;
},*/

// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();