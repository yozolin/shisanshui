var AudioManager = require('AudioManager');
cc.Class({
    extends: cc.Component,

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
        popNode:cc.Node,
        label:cc.Label,

        _alertCallback: null,
        _willDismissCallback: null,
        _dismissCallback: null,
        _confirmCallback: null,   // 点击确定后的回调
        _tishi:null,
        _card_num:null,
    },

    // use this for initialization
    onLoad: function () {
      
    },

    alert:function() {
        this.node.active = true;
        var anim = this.popNode.getComponent(cc.Animation);
        anim.play('pop');

        if (this._alertCallback) {
          this._alertCallback(this.node);
        }
    },
    /*#####弹出结果*/
    alertResult: function () {
        this.node.active = true;
        cc.find("Canvas/show_result").active = false;
        var anim = this.popNode.getComponent(cc.Animation);
        anim.play('pop');

        if (this._alertCallback) {
          this._alertCallback(this.node);
        }
    },

    /*#####点击确定*/
    playBtnClickSFX:function() {
        AudioManager.instance.playBtnClickSFX();
    },

    /*#####点击取消*/
    palyBtnCancelClickSFX:function(){
        AudioManager.instance.palyBtnCancelClickSFX();
    },

    /*#####点击关闭或者按键之类的按钮，播放音效*/
    palyBtnPublicSFX: function () {
        AudioManager.instance.palyBtnPublicSFX();
    },

    /*#####点击创建房间，播放音效*/
    palyBtnCreateRoomSFX: function () {
        AudioManager.instance.palyBtnCreateRoomSFX();
    },
    /*#####点击创建房间，播放音效*/
    palyWindowSFX: function () {
        AudioManager.instance.palyWindowSFX();
    },

    palyWeiXinLoginSFX:function() {
        AudioManager.instance.palyWeiXinLoginSFX();
    },
    palyFangPaiSFX: function () {
        AudioManager.instance.palyFangPaiSFX();
    },

    dismissAction:function() {
      let willDismissCallback = this._willDismissCallback;
      if (willDismissCallback) {
        let result = willDismissCallback();
        if (result) {
          this.dismissComplete();
          return;
        }
      }

        var anim = this.popNode.getComponent(cc.Animation);
        var dismissAnim = anim.getAnimationState('pop_dismiss');
        dismissAnim.on('finished',this.dismissComplete,this);
        anim.play('pop_dismiss');
    },

    /*#####隐藏结果页面*/
    dismissActionResult:function() {
      let willDismissCallback = this._willDismissCallback;
      if (willDismissCallback) {
        let result = willDismissCallback();
        if (result) {
          this.dismissComplete();
          return;
        }
      }

        var anim = this.popNode.getComponent(cc.Animation);
        var dismissAnim = anim.getAnimationState('pop_dismiss');
        dismissAnim.on('finished',this.dismissComplete,this);
        anim.play('pop_dismiss');
        cc.find("Canvas/show_result").active = true;
    },

    dismissComplete:function() {
        this.node.active = false;

        if (this.onDismissComplete) {
          this.onDismissComplete();
        }

        if (this._dismissCallback) {
          this._dismissCallback(this.node);
        }
    },
    dismissPlay:function() {
      cc.director.loadScene("hall");  
    },

    onDismissComplete:function() {
      //cc.log("onDismissComplete");
    },

    doneAction:function() {
        this.dismissAction();
        this.onDoneAction();

        let confirmCallback = this._confirmCallback;
        if (confirmCallback) {
          confirmCallback(this.node);
        }
    },

    onDoneAction:function() {

    },

    setMessage:function(msg) {
        this.label.string = msg;
    },

    getMessage: function () {
      return this.label.string;
    },

    setAlertCallbck: function (callback) {
      this._alertCallback = callback;
    },

    setWillDismissCallback: function (callback) {
      this._willDismissCallback = callback;
    },

    setDismissCallback: function (callback) {
      this._dismissCallback = callback;
    },

    setConfirmCallback: function (callback) {
      this._confirmCallback = callback;
    },

    /*setMessage: function (message) {
      this.label.getComponent('cc.Label').string = message;
    },*/

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
