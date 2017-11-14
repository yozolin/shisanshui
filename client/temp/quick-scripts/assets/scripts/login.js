(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/login.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9c72dn88ytPxZWrZRaxt5cr', 'login', __filename);
// scripts/login.js

'use strict';

var manager = require('manager');
var KQCard = require('KQCard');
var Socket = require('socket');
var KQCardFindTypeExtension = require('KQCardFindTypeExtension');
var KQGlobalEvent = require('KQGlobalEvent');
var AudioManager = require('AudioManager');
var KQNativeInvoke = require('KQNativeInvoke');
var KQGlabolSocketEventHander = require('KQGlabolSocketEventHander');

var APPID = 'wxe8993f468b16fa5d';
var ROOMID = '';
//授权地址
//正式地址
// var REDIRECT_URI = "http%3A%2F%2Fwww.honggefeng.cn%2FsszWeb%2Findex.php";
// 测试地址
var REDIRECT_URI = "http%3a%2f%2fo1o2.cn";

var HREF = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

cc.Class({

    extends: cc.Component,
    properties: {
        //selectNode:cc.Node,
        alertPrefab: cc.Prefab,
        canvasNode: cc.Node,
        loadingNode: cc.Node,
        //err:cc.Node,
        waitingPrefab: cc.Prefab,
        recordInfo: cc.Prefab,
        label: cc.Label
    },

    goUpdateAction: function goUpdateAction() {
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod("AppController", "downloadNewVersion:", this.iosUrl);
        } else {
            //Android
            jsb.reflection.callStaticMethod("com/gongpa/ssz/AppActivity", "downloadNewVersion", "(Ljava/lang/String;)V", this.androidUrl);
        }
    },

    checkVersion: function checkVersion(vData) {
        //var version = vData.version;
        cc.info1 = vData.version;
        this.iosUrl = vData.iosUrl;
        this.androidUrl = vData.androidUrl;
        //if (manager.version != version) {//更新版本
        //    this.versionEnable = false;
        //    this.goUpdateAction();
        //    //this.versionLabel.string = '请到服务器更新到最新版本';
        //}
        //else {
        //this.versionLabel.string = '当前版本 ' + manager.version;
        if (KQNativeInvoke.isNativeIOS()) {
            // if(iosVersion != manager.version) {
            //     this.versionEnable = false;
            //     var updateAlert = cc.find("Canvas/update").getComponent("alert");
            //     updateAlert.alert();
            // }
            // else {
            this.versionEnable = true;
            var self = this;
            var info = manager.getUserInfo();
            if (info.length == 0) {
                this.loginEnable = true;
            }
            this.scheduleOnce(function () {
                if (info.length > 0) {
                    this.loginEnable = true;
                    self.loginAction();
                }
            }, 0.5);
            //}
        } else if (KQNativeInvoke.isNativeAndroid()) {
            // if(androidVersion != manager.version) {
            //     this.versionEnable = false;
            //     var updateAlert = cc.find("Canvas/update").getComponent("alert");
            //     updateAlert.alert();
            // }
            // else {
            this.versionEnable = true;
            var self = this;
            var info = manager.getUserInfo();
            if (info.length == 0) {
                this.loginEnable = true;
            }
            this.scheduleOnce(function () {
                if (info.length > 0) {
                    this.loginEnable = true;
                    self.loginAction();
                }
            }, 0.5);
            //}
        } else {
            this.versionEnable = true;
            var self = this;
            // var info = manager.getUserInfo();
            // if (info.length == 0) {
            //     this.loginEnable = true;
            // }
            this.scheduleOnce(function () {
                if (!cc.sys.isNative) {
                    var recordId = self.getQueryString('recordId');
                    if (recordId) {
                        Socket.sendGetRecrodFromId(recordId);
                        return;
                    }
                    var roomId = self.getQueryString("roomId");
                    if (roomId) {
                        var info = manager.getUserInfo();
                        if (info.length > 0) {
                            var data = JSON.parse(info);
                            if (!data.errcode) {
                                self.sendLoginRequest(data);
                            } else {
                                manager.setUserInfo("");
                            }
                            return;
                        } else {
                            self._get_HREF(roomId);
                        }
                    }
                }
                var info = manager.getUserInfo();
                if (info.length > 0) {
                    var data = null;
                    try {
                        data = JSON.parse(info);
                    } catch (e) {
                        manager.setUserInfo("");
                        data = null;
                    }
                    if (!data || data.errcode) {
                        manager.setUserInfo("");
                    } else {
                        this.loginEnable = true;
                        self.loginAction();
                    }
                } else {
                    if (!cc.sys.isNative) {
                        var code = self.getQueryString("code");
                        var roomId = self.getQueryString("roomId");
                        if (roomId) {
                            var info = manager.getUserInfo();
                            if (info.length > 0) {
                                var data = JSON.parse(info);
                                if (!data.errcode) {
                                    self.sendLoginRequest(data);
                                } else {
                                    manager.setUserInfo("");
                                }
                                return;
                            } else {
                                self._get_HREF(roomId);
                            }
                        }
                        if (code) {
                            try {
                                var obj = new XMLHttpRequest(); // XMLHttpRequest对象用于在后台与服务器交换数据
                                var url = "./get_token.php";
                                obj.open("POST", url, true);
                                obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // 添加http头，发送信息至服务器时内容编码类型
                                obj.onreadystatechange = function () {
                                    if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {
                                        // 304未修改
                                        //alert(obj.responseText);
                                        var data = JSON.parse(obj.responseText);
                                        if (!data.errcode) {
                                            manager.setUserInfo(obj.responseText);
                                            self.sendLoginRequest(data);
                                        }
                                    }
                                };
                                obj.send("code=" + code);
                            } catch (e) {
                                //alert(e);
                            }
                        }
                    }
                }
            }, 0.5);
        }
        //}
    },
    keyBackListen: function keyBackListen() {
        var _this = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (e) {
            if (e.keyCode == cc.KEY.back) {
                if (!KQNativeInvoke.isNativeIOS()) {
                    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "backToDesk", "()V");
                }
            }
        }, this);
    },
    onLoad: function onLoad() {
        this.keyBackListen();
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var canvas = cc.find("Canvas");
            var cvs = canvas.getComponent(cc.Canvas);
        }
        KQGlabolSocketEventHander.start();
        this.socket = cc.find('GameSocket').getComponent('socket');
        var self = this;
        this.loginEnable = false;
        this.socket.receviceMessage = function (response) {
            var data = JSON.parse(response);
            //console.log(data)
            if (data.action == 'checkVersion') {
                try {
                    self.checkVersion(data.data);
                } catch (e) {
                    //this.err.string = e;
                }
            } else if (data.action == 'login') {
                if (data.result) {
                    //成功
                    self.socket.userInfo = data.data; //运行时态信息
                    if (!cc.sys.isNative) {
                        var roomId = self.getQueryString("roomId");
                        //console.log(roomId);
                        if (roomId) {
                            var userId = data.data.id;
                            var exitInRoom = data.data.roomId;
                            if (exitInRoom != "") {
                                roomId = exitInRoom;
                            }
                            Socket.sendLoginJoin(roomId, userId);
                            return;
                        }
                    }
                    self._loadingLabel("登录中");
                    if (data.data.roomId.length > 0) {
                        cc.director.loadScene('play');
                    } else {
                        cc.director.loadScene('hall');
                    }
                } else {
                    // self.alertMessage('登录失败!');
                }
            }
        };
        this._registerSocketEvent();

        this.socket.getWxInfo = function (info) {
            manager.setUserInfo(info); //保存本地
            var data = JSON.parse(info); //str -> json(obj)
            self.scheduleOnce(function () {
                //延迟执行 1s
                self.sendLoginRequest(data); //登录请求
            }, 1);
        };

        // let search = window.location.search;
        // var openid = "JzIwMTcvNi8xNiDkuIrljYgxMMzowOCc=";
        // var unionid = '8dOtAcDic5Sichv3lxtMXYJgmunTLOLv';
        // var nickname = "哇哈哈";
        // if (search) {
        //     var url = window.location.search;
        //     var loc = url.substring(url.lastIndexOf('=') + 1, url.length);
        //     if (loc == 1) {
        //         openid = 'JzIwMTctNi0xNiAwOTo0NTo1OSc=';
        //         unionid = 'JzIwMTctNi0xNiAwOTo0NTo1OSc';
        //         nickname = loc;
        //     }
        //     else if (loc == 2) {
        //         openid = 'JzIwMTcvNi8xNiDkuIrljYg5OjM4OjMzJw==';
        //         unionid = 'JzIwMTcvNi8xNiDkuIrljYg5OjM4OjMzJw';
        //         nickname = loc;
        //     }
        //     else if (loc == 3) {
        //         openid = 'JzIwMTctNi0xNiAwOTo0NToc=';
        //         unionid = '8dOtAcDic5Sichv3lxtMXYmunTLOLv';
        //         nickname = loc;
        //     }
        //     else if (loc == 4) {
        //         openid = 'ozlXIwgv_QJT0ykdUihaABmsWp2A';
        //         unionid = 'o-3911qWsQsW3wUodqFfUtbsAeNk';
        //         nickname = loc;
        //     }
        //     else if (loc == 5) {
        //         openid = 'JzIwMTcvNi8xNiDkuIrljYgxMDowMzowOCc=';
        //          unionid = 'o-JzIwMTcvNi8xNiDkuIrljYgxMDowM';
        //         nickname = loc;
        //     }else if(loc == 6){
        //         openid = 'JzIwMTcvNi8xNiDkuIrljYgxMMzoc=';
        //          unionid = 'o-zIwMTcvNi8xNiDkuIrl';
        //         nickname = loc;
        //     }

        // }
        // var testData = '{"openid":"'+openid+'","nickname":"'+nickname+'","unionid":"'+unionid+'","sex":1,"language":"zh_CN","city":"Changsha","province":"Hunan","country":"CN","headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/8D8dOtAcDic5Sichv3lxtMXYJgmunTLOLvTT5AFM4zaqKEthZibv8xdWkgjN9Yb4AQnwvSurz27UB29xx81XORwx55XanxqctdD\/0","privilege":[]}';

        // if (!cc.sys.isNative){
        //     manager.setUserInfo(testData);
        // }
    },

    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.ReceiveLoginJoin, this._LoginJoin, this);
        KQGlobalEvent.on(Socket.Event.ReceiveRecordId, this._ReceiveRecordId, this);
        KQGlobalEvent.on(Socket.Event.ReceiveNoUionid, this._ReceiveNoUionid, this);
    },
    _get_HREF: function _get_HREF(roomId) {
        if (roomId != ROOMID) {
            ROOMID = roomId;
            roomId = "%3froomId%3d" + roomId;
            REDIRECT_URI = REDIRECT_URI + roomId;
            HREF = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }
    },
    _ReceiveNoUionid: function _ReceiveNoUionid(response) {
        manager.setUserInfo("");
        var self = this;
        var roomId = this.getQueryString("roomId");
        if (roomId) {
            //roomId = "%3froomId%3d"+roomId ;
            //REDIRECT_URI = REDIRECT_URI+roomId;
            this._get_HREF(roomId);
        }
        setTimeout(function () {
            self.loadingNode.parent.active = false;
            self.loadingNode.stopAllActions();
        }, 2000);
        this._loadingLabel("登录失败，请重新登录");
    },
    _ReceiveRecordId: function _ReceiveRecordId(response) {
        var data = response.data;
        if (data.recordMsg.length > 0) {
            var record = data.recordMsg[0];
            var playersInfo = JSON.parse(record.playersInfo).players;
            var recordNode = cc.instantiate(this.recordInfo);
            var totalGameResult = recordNode.getComponent("TotalGameResult");
            playersInfo.sort(function (a, b) {
                return b.totalScore - a.totalScore;
            }); // 排序
            totalGameResult.setPlayerInfos(playersInfo, record);
            totalGameResult._clickBtn();
            recordNode.getComponent('alert').alert();
            this.node.addChild(recordNode);
        }
    },
    _LoginJoin: function _LoginJoin(response) {
        this._loadingLabel("进入房间，正在为您请求数据");
        if (response.result) {
            if (cc.from == null) {
                cc.from = {};
            }
            cc.from.ma = response.data.maPai;
            cc.director.loadScene('play');
        } else {
            cc.joinDesk = {};
            cc.director.loadScene('hall');
            var reasonInfo = this._joinReasonMap(response.data.reason);
            cc.joinDesk.result = response.result;
            cc.joinDesk.reason = reasonInfo;
        }
    },
    _joinReasonMap: function _joinReasonMap(reason) {
        var reasonInfo = {
            notExist: "房间不存在!",
            cardNumber: "您房卡不足!"
        };
        var info = reasonInfo[reason] || "房间已满!";
        return info;
    },

    getQueryString: function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);return null;
    },

    agreements: function agreements() {
        this.agreementNode.active = true;
        //this.agreementLabel.string = cc.info1;
        this.agreementLabel.node.y = 0;
    },

    onDestroy: function onDestroy() {
        this.socket.receviceMessage = function () {};
    },

    _loadingLabel: function _loadingLabel(label) {
        this.label.string = label;
    },

    sendLoginRequest: function sendLoginRequest(data) {
        //this.showWaitingMessage('登录中...');
        this.loadingNode.parent.active = true;
        this.loadingNode.runAction(cc.repeatForever(cc.rotateBy(2, 360)));
        //return;
        this.socket.sendMessage('login', data);
    },

    loginAction: function loginAction() {
        var info = manager.getUserInfo();
        if (info.length > 0) {
            var data = JSON.parse(info);
            this.sendLoginRequest(data);
            return;
        }
        if (!cc.sys.isNative) {
            // cc.sys.openURL(HREF);
            window.location.href = HREF;
        } else {
            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxLogin"); //IOS
            } else if (KQNativeInvoke.isNativeAndroid()) {
                //Android
                jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxLogin", "()V");
            }
        }
    },

    loginYkAction: function loginYkAction() {
        //var comp = this.selectNode.getComponent('select');
        //if (!comp.selected) {
        //    this.showMsg = cc.instantiate(this.alertPrefab);
        //    this.canvasNode.addChild(this.showMsg);
        //    let comp = this.showMsg.getComponent('alert');
        //    comp.setMessage('请同意用户协议');
        //    return;
        //}
        var testDate = new Date();
        var time = "'" + testDate.toLocaleString() + "'";
        var openid = new Buffer(time).toString('base64');
        var testData = '{"openid":"' + openid + '","nickname":"游客","sex":1,"language":"zh_CN","city":"Changsha","province":"Hunan","country":"CN","headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/BVyz4R8q6puJibEv1hrsaTmIKQhkaTS9FyvcevvC5hlxFnfOuspDjicG0GtzyJXOhNT7g1WZDeCDQhnRdEOgz3QMnP0F9iboQGy\/0","privilege":[]}';
        var data = JSON.parse(testData);
        this.sendLoginRequest(data);
    },

    showWaitingMessage: function showWaitingMessage(msg) {
        if (this.waitingNode != null && cc.sys.isNative && cc.isValid(this.waitingNode)) {
            if (msg == this.waitingNode.getComponent('alert').getMessage()) {
                return;
            }
            this.waitingNode.removeFromParent();
            this.waitingNode = null;
        }
        this.waitingNode = cc.instantiate(this.waitingPrefab);
        this.canvasNode.addChild(this.waitingNode);
        var comp = this.waitingNode.getComponent('alert');
        //console.log(comp);

        comp.setMessage(msg);
        comp.alert();
    },

    hiddenWaitingMessage: function hiddenWaitingMessage() {
        if (this.waitingNode != null) {
            this.waitingNode.getComponent('alert').dismissAction();
        }
    },

    protocolAction: function protocolAction() {
        cc.log('protocol action');
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
        //# sourceMappingURL=login.js.map
        