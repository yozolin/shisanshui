"use strict";
cc._RFpush(module, 'cb225d0jXtB0JToI7yXR0hG', 'changInfo');
// scripts\changInfo.js

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');

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
        phoneEditBox: cc.EditBox,
        wxEditBox: cc.EditBox,
        alert: cc.Prefab,
        canvas: cc.Node,
        _userId: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._userId = Socket.instance.userInfo.id;
        this._registerSocketEvent();
    },

    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.ReceiveOnChangeInfo, this._ReceiveChangeInfo, this);
    },
    _ReceiveChangeInfo: function _ReceiveChangeInfo(response) {
        var changedRows = response.data;
        var msg = '';
        //console.log(response);
        //console.log(changedRows);
        //console.log("-------------------------------38");
        if (changedRows) {
            msg = "更改成功";
        } else {
            msg = "今天已经更新过了，请明天再更新";
        }
        this.alertMsg(msg);
    },
    clickAction: function clickAction() {
        var wx = this.wxEditBox.string;
        var phone = this.phoneEditBox.string;
        var info = {};
        var msg = '';
        if (!wx && !phone) {
            msg = "请填写微信号和手机号";
            phone = "";
            this.alertMsg(msg);
            return;
        }
        if (!/(^[1-9]\d*$)/.test(phone)) {
            msg = "您输入的手机号码格式不对，请重新输入";
            phone = "";
            this.alertMsg(msg);
            return;
        }
        if (phone.length != 11) {
            msg = "您输入的手机号码不够11位，请重新输入";
            phone = "";
            this.alertMsg(msg);
            return;
        }
        if (!/(^[1-9a-zA-Z]\d*$)/.test(wx)) {
            msg = "您输入的微信号格式不对，请重新输入";
            wx = "";
            this.alertMsg(msg);
            return;
        }
        if (wx.length < 6 || wx.length > 20) {
            msg = "您输入的微信号格式超出范围，请输入6~20位的微信号";
            wx = "";
            this.alertMsg(msg);
            return;
        }
        info.wx = wx;
        info.phone = phone;
        Socket.sendChangeInfo(this._userId, info);
    },

    alertMsg: function alertMsg(msg) {
        var alert = cc.instantiate(this.alert);
        this.canvas.addChild(alert);
        var comp = alert.getComponent('alert');
        comp.setMessage(msg);
    }
});

cc._RFpop();