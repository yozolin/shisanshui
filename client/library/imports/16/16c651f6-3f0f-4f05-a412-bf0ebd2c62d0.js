var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var ArrayExtension = require('ArrayExtension');
var Manager = require('manager');
var AudioManager = require('AudioManager');
var KQNativeInvoke = require('KQNativeInvoke');
var UserModelHelper = require('UserModelHelper');
var Playback = require('Playback');
var fecha = require('fecha');
var manager = require('manager');
/*#####*/
var KQCard = require('KQCard');
/**/
var Player = require('Player');
/**/
//const isTeShuPai = require('isTeShuPai');
//特殊牌类型
var TESHUPAITYPE = {
    isTeShuPai: false,
    isLiuDuiBan: false,
    isSanShunZi: false,
    isSanTaoHua: false,

    isQingLong: false,
    isYiTiaoLong: false,
    isSanTongHuaShun: false,
    isSanFenTianXia: false,
    isCouYiSe: false,
    isSiTaoSanTiao: false,
    isWuDuiSanTiao: false
};

var GAMESTATUS = {
    WAIT_PEOPLE: 0, // 等人
    WAIT_READY: 1, // 等待他人准备
    PLAYING: 2 };
// 正在玩游戏
var sTitle = '';
var sDescription = '';
var sId = '';
// 布局
//          2
//   3            1
//     self 0
var Play = cc.Class({
    'extends': cc.Component,

    properties: {
        playerNodes: [cc.Node],
        //playsCoins: [cc.Node],
        chatNode: cc.Node,
        cardTypeCombineNode: cc.Node,
        typeButtonsNode: cc.Node,
        phone: cc.Label,
        labelRoomNumber: cc.Label,
        labelOverview: cc.Label,
        labelRemainTime: cc.Label,
        btnShare: cc.Button,
        btnReady: cc.Button, // 准备按钮
        btnStartGame: cc.Button, // 开始按钮
        beilv: cc.Node, // 选择倍率节点
        btnChatVoice: cc.Button,
        btnChatText: cc.Button,
        againBtn: cc.Node,

        startCompareCardsNode: cc.Node,
        settingNode: cc.Node,
        VoiceMsgBg: cc.Node,
        exit: cc.Node, // 离开房间节点
        Dissolve: cc.Node, // 解散房间节点
        shareBg: cc.Node, // 分享背景
        totalGameResult: cc.Node, // 结果节点
        alertRequestExitNode: cc.Node, // 申请退出 Node
        dissolveAlter: cc.Node, // 申请退出 Node
        alertRequestExitCountdownNode: cc.Node, // 申请退出倒计时 Node
        alertAnsowerExitNode: cc.Node, // 回答申请退出  Node
        contentAnsowerExitNode: cc.Node, // 回答申请退出头像  Node
        alertAnsowerExitResult: cc.Node, // 回答申请退出结果  Node
        alertAnsowerExitCountdownNode: cc.Node, // 回答以上请退出的倒计时
        Countdown: cc.Node, // 倒计时
        labelTime: cc.Label,
        needCard: cc.Label,
        alert: cc.Node,
        coinsContainerNode: cc.Node,
        btnAlertRequestExitConfirmButton: cc.Button,
        btnAlertRequestExitCancelButton: cc.Button,

        autoTishi: cc.Prefab,
        waitingPrefab: cc.Prefab,
        coinsPrefab: cc.Prefab,
        playerComps: [Player],

        gongXiNi: cc.Node,
        teShuPai: cc.Node,

        cardSpriteAtlas: cc.SpriteAtlas,
        daoSpriteAtlas: cc.SpriteAtlas,

        _liuDuiBan: false,
        _sanShunZi: false,
        _sanTongHua: false,
        _yiTiaoLong: false,

        _QingLong: false,
        _SanTongHuaShun: false,
        _SanFenTianXia: false,
        _CouYiSe: false,
        _SiTaoSanTiao: false,
        _WuDuiSanTiao: false,

        _playerComponents: null,
        _msgControl: null,
        _nowTimeAgain: 0,

        _socket: null,
        _userId: 0,
        _playerInfos: null,
        _deskInfo: null, // createTime 创建时间  isDissolving 表示是否正在解散 dissolveLeftTime 离解散剩余多长时间 dissolveAnswerInfo [处理过的人的信息]
        _gameStatus: GAMESTATUS.WAIT_PEOPLE,
        _enterTime: null,
        _bigRecordInfo: null,
        _players: null,
        /**/
        _isComparingCardsNow: false, // 是否正在比牌
        _playedCompareCardsIndexs: [], // 已经播放过比牌的局数
        /**/
        fapaiNode: cc.Prefab,
        liuduiban: cc.Prefab,
        santonghua: cc.Prefab,
        sanshunzi: cc.Prefab,
        quanleida: cc.Prefab
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
    // use this for initialization
    onLoad: function onLoad() {
        var _this2 = this;

        this.keyBackListen();
        this.headCardTime = 0.85;
        var bg = this.node.getChildByName("room_bg");
        var windowP = cc.director.getWinSizeInPixels();
        var scaleX = windowP.width / bg.width;
        var scaleY = windowP.height / bg.height;
        var scale = Math.max(scaleX, scaleY);
        bg.scaleX = scale;
        bg.scaleY = scale;

        this.BtnClickGongXiNiComfirm = this.cardTypeCombineNode.getComponent("CardTypeCombine").BtnClickGongXiNiComfirm;
        this._enterTime = Date.now();
        /**/
        this.playerComps.forEach(function (playerComp) {
            playerComp.playedCompareCardsIndexs = _this2._playedCompareCardsIndexs;
        });
        /**/
        /*AudioManager.instance.playDeskMusic();*/

        AudioManager.instance.stopHallMusic();
        var bgSound = cc.sys.localStorage.getItem("bgSound");
        if (bgSound == 0) {
            var audioManager = cc.find('AudioManager');
            audioManager = audioManager.getComponent('AudioManager');
            audioManager.setEffectMusicVolum(bgSound);
        }

        this._initPlayerComponents();
        this._initSelectCardNode();
        this._initOneGameResult();
        this._remainTimeStartUpdate();

        this._userId = Socket.instance.userInfo.id;
        this._msgControl = this.chatNode.getComponent('MsgControl');
        this._userId = Socket.instance.userInfo.id;
        this.beilv.getComponent("selectbeilv")._userid = this._userId;
        //this.settingNode.getComponent("Setting").hideSwitch();
        this.labelRoomNumber.string = "";
        this.labelRemainTime.node.active = false;

        this._registerVoiceNodeEvents();
        this._registerSocketEvent();

        Play.instances = this;
        this._gongXiNiShow(false);
        if (Playback.instance.isContainPlaybackDatas()) {
            Playback.instance.startPlayback();
            this.playbackNode.active = true;
            this.btnChatVoice.node.active = false;
            //this.cardsFromArray.node.active = false;
        } else {
                this._loadDeskInfo();
            }

        this._socket = Socket.instance;

        cc.director.preloadScene('hall', function () {
            cc.director.preloadScene('login');
        });

        cc.clickOut = false;
        //this.timeStart(5);
    },

    timeStart: function timeStart(duration, action) {
        cc.assert(duration > 0);
        this.timeStop();
        this.Countdown.active = true;
        if (action != "ready") {
            var timestamp = cc.sys.localStorage.getItem("timestamp"); // 获取本地存储的时间戳
            if (timestamp) {
                // 如果有则证明玩家是重新进来了的
                var now = Date.parse(new Date());
                var time = duration * 1000;
                if (now - timestamp > time) {
                    // 超时
                    if (now - timestamp < 2 * time) {
                        duration = 5; // 玩家可能出于其他原因退出游戏导致超时，为其提供5秒时间整理牌型（这已经是很仁慈的了）。
                    } else {
                            cc.sys.localStorage.removeItem("timestamp");
                        }
                } else {
                    duration = Math.floor(duration - (now - timestamp) / 1000);
                }
            } else {
                // 如果没有时间戳，则保存，为玩家退出游戏保留证据；
                var timestamp = Date.parse(new Date());
                cc.sys.localStorage.setItem('timestamp', timestamp);
            }
        }
        this._timeRemainDuration = duration;
        this.labelTime.string = String(duration);
        this.Countdown.getComponent("time").setTime(duration * 0.5);
        var self = this;
        this.callback = function () {
            self._timeMethod(action);
        };
        this.schedule(this.callback, 1, duration);
    },

    timeStop: function timeStop() {
        this.unschedule(this.callback);
        this.Countdown.active = false;
    },

    _timeMethod: function _timeMethod(action) {
        this._timeRemainDuration = this._timeRemainDuration - 1;

        var remain = Math.max(this._timeRemainDuration, 0);
        this.labelTime.string = remain < 10 && remain > 0 ? '0' + remain : remain;

        if (this._timeRemainDuration <= 0) {
            this.timeStop();
            if (action == "ready") {
                if (this._deskInfo.cIndex > 0) {
                    this.clickReady();
                }
            }
            cc.sys.localStorage.removeItem("timestamp");
            return;
        }
    },

    _globalMsg: function _globalMsg(data) {
        //if(!cc.sys.isNative){
        var roomId = data.roomId;
        var wf = data.setting3; ///[疯狂场,鬼牌,比花色,坐庄,马牌]
        var room = "房号：" + roomId;
        var fk = wf[0] ? "疯狂场 " : "普通场 "; // 疯狂场
        var gp = wf[1] ? "鬼牌 " : "无鬼 "; // 鬼牌
        var hs = wf[2] ? "比花色 " : "不比花色 "; // 比花色
        var zj = wf[3] ? "坐庄 " : "不坐庄 "; // 庄家
        var mp = wf[4] ? "买马 " : "不买马 "; // 马牌
        var sf = "房费:" + (data.setting4 ? data.setting4 == 1 ? "赢者扣 " : "房主扣 " : "平摊 "); //收费
        var shareTitle = room + " 模式:" + zj + sf;

        var pj = ["5局 ", "10局 ", "20局 "]; //牌局
        var ds = ["4人不加色 ", "5人加一色 ", "6人二色 ", "7人加三色 "]; //多色
        var rs = ds[data.setting2] + "";
        var js = pj[data.setting1 - 2];
        var desc = '[大众十三水] ' + zj + fk + mp + gp + sf + rs + js + " 点击直接进入房间";

        sTitle = shareTitle;
        sDescription = desc;
        sId = 'roomId=' + roomId;

        cc.sys.localStorage.setItem('roomId', roomId);
        cc.sys.localStorage.setItem('shareTitle', shareTitle);
        cc.sys.localStorage.setItem('desc', desc);

        if (cc.sys.isBrowser) {
            if (window.shareToTimeLine) {
                window.shareToTimeLine();
            }
            if (window.shareToSession) {
                window.shareToSession();
            }
        }
        //}
    },

    /*#####*/
    /*显示马牌*/
    _initMaPai: function _initMaPai() {},

    _initPlayerComponents: function _initPlayerComponents(playerIndex) {
        this._playerComponents = this.playerNodes.map(function (node) {
            return node.getComponent('Player');
        });

        if (!playerIndex) {
            playerIndex = [0, 1, 2, 3, 4, 5];
        }

        var a = this._playerComponents.splice(1, 7);

        for (var i = 0; i < playerIndex.length - 1; i++) {
            var index1 = playerIndex[i];
            var index2 = playerIndex[i + 1];
            var tmp = null;
            tmp = a[index1];
            a[index1] = a[index2];
            a[index2] = tmp;
        }

        a.forEach((function (node) {
            this._playerComponents.push(node);
        }).bind(this));

        if (this.playsCoins && this.playsCoins.length > 0) {
            this.playsCoins.forEach((function (node) {
                node.active = false;
            }).bind(this));
        }

        this.playsCoins = [];

        this._playerComponents.forEach((function (plays, i) {
            var name = "coins" + i;

            var node = new cc.Node();

            node.name = name;

            node.x = plays.node.x;

            node.y = plays.node.y;

            this.node.addChild(node);

            this.playsCoins.push(node);
        }).bind(this));
    },

    _initSelectCardNode: function _initSelectCardNode() {
        var self = this;
        var cardTypeCombineComp = this.cardTypeCombineNode.getComponent('CardTypeCombine');
        cardTypeCombineComp.setFinishSelectCardsCallback(function (serverCardsInfo) {
            cardTypeCombineComp.reset();
            Socket.sendPlayCard(self._userId, serverCardsInfo);
            self.cardTypeCombineNode.active = false;
        });
    },

    /**/
    _initOneGameResult: function _initOneGameResult() {
        var self = this;
        // this.oneGameResult.setCloseCallback = function () {
        //     if (self._isRandomRoom()) {
        //         cc.director.loadScene('hall');
        //     }
        // };
    },

    onDestroy: function onDestroy() {
        KQGlobalEvent.offTarget(this);
    },

    clickLeaveDesk: function clickLeaveDesk() {
        // 点击离开桌子
        if (this._deskInfo.cIndex == 0) {
            // 还没开始可以退出房间
            if (this._deskInfo.createId == this._userId) {
                cc.director.loadScene('hall');
            } else {
                Socket.sendLeaveDesk(this._userId);
            }
        }
    },
    clickDissolveDesk: function clickDissolveDesk() {
        // 点击解散桌子
        if (this._deskInfo.createId == this._userId) {
            // 只有房主才能解散桌子
            this.btnAlertRequestExitCancelButton.node.active = true;
            this.btnAlertRequestExitConfirmButton.node.active = true;
            var _alert = this.alertRequestExitNode.getComponent('alert');
            _alert.unscheduleAllCallbacks();
            _alert.setMessage("是否要解散房间");
            _alert.alert();
        }
    },

    clickExitOut: function clickExitOut() {
        Socket.sendDissolveDesk(this._userId);
    },

    //解散退出房间
    clickExit: function clickExit() {
        if (Playback.instance.isPlaybacking()) {
            cc.director.loadScene('hall');
            return;
        }
        /**/
        if (this._deskInfo && this._deskInfo.isDeskOver) {
            if (!this._isComparingCardsNow) {
                // 如果房间已结束，并且不是正在播放打牌动画, 则直接离开房间
                cc.director.loadScene('hall');
            }
            return;
        }
        /**/
        //if (this._isRandomRoom()) {
        //    this.alertForceExitNode.getComponent('alert').alert();
        //    return;
        //}
        if (this._deskInfo.cIndex == 0) {
            if (this._deskInfo.createId == this._userId) {
                var alert1 = this.dissolveAlter.getComponent('alert');
                alert1.alert();
            } else {
                Socket.sendLeaveDesk(this._userId);
            }
            return;
        }
        this.btnAlertRequestExitCancelButton.node.active = true;
        this.btnAlertRequestExitConfirmButton.node.active = true;

        var alert = this.alertRequestExitNode.getComponent('alert');
        alert.unscheduleAllCallbacks();
        alert.setMessage("是否解散房间？");
        alert.alert();

        this.alertRequestExitCountdownNode.getComponent('Countdown').stop();
    },
    //不解散退出房间
    clickOut: function clickOut() {
        if (this._deskInfo.cIndex == 0) {
            if (this._deskInfo.createId == this._userId) {
                cc.clickOut = true;
                cc.director.loadScene('hall');
                return;
            } else {
                Socket.sendLeaveDesk(this._userId);
            }
        }
    },

    clickShareBg: function clickShareBg() {
        cc.find("Canvas/shareBg").active = false;
        this.shareBg.active = false;
    },
    guanzhu: function guanzhu() {
        // var url = "http://www.honggefeng.cn/gzh/index.html";
        // cc.sys.openURL(url)
    },
    recordShare: function recordShare() {
        if (this._deskInfo.recordId) {
            var shareTitle = "[大众十三水]战绩";
            var roomId = "房间号：" + this._deskInfo.roomId;
            var pj = ["5 ", "10 ", "20 "]; //牌局
            var js = "局数：" + pj[this._deskInfo.setting1 - 2];
            var time = "时间：" + this._deskInfo.createTime;
            var desc = roomId + js + time + "点击查看详情";

            var recordId = this._deskInfo.recordId;
            cc.sys.localStorage.setItem("shareTitle", shareTitle);
            cc.sys.localStorage.setItem("desc", desc);
            cc.sys.localStorage.setItem("recordId", recordId);
            cc.sys.localStorage.setItem("roomId", '');

            sTitle = shareTitle;
            sDescription = desc;
            sId = 'roomId=' + roomId;
            if (recordId) {
                sId = 'recordId=' + recordId;
            }

            if (cc.sys.isBrowser) {
                if (window.shareToTimeLine) {
                    window.shareToTimeLine();
                }
                if (window.shareToSession) {
                    window.shareToSession();
                }
            }
        };
        if (!cc.sys.isNative) {
            cc.find("Canvas/shareBg").active = true;
        } else {
            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxScreenShareFriend");
            } else {
                //Android
                KQNativeInvoke.screenshotShare();
            }
        }
    },
    // 点击桌面分享
    clickDeskShare: function clickDeskShare() {
        //this._globalMsg(this._deskInfo);
        if (!cc.sys.isNative) {
            var shareBg = cc.find("Canvas/shareBg");
            shareBg.active = true;
            //var wxBg = this.shareBg.getChildByName("wx");
            //var pyqBg = this.shareBg.getChildByName("PYQ");
            //wxBg.active = true;
            //pyqBg.active = false;
            //this.shareBg.active = true;
        }
        var id = sId;
        var title = sTitle;
        var description = sDescription;
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend:description:", id, description, title);
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android
            var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", str, id, description, title);
        }
    },
    //点击分享按钮
    clickShare: function clickShare() {
        //this._globalMsg(this._deskInfo);
        if (!cc.sys.isNative) {
            var wxBg = this.shareBg.getChildByName("wx");
            var pyqBg = this.shareBg.getChildByName("PYQ");
            wxBg.active = true;
            pyqBg.active = false;
            this.shareBg.active = true;
        }
        var id = sId;
        var title = sTitle;
        var description = sDescription;

        // let roomId = String(this._deskInfo.roomId);
        // var description = "大众十三水 玩法:"
        // description = description + " " + this._deskInfoNumberOfPeople();
        // description = description + "," + this._deskInfoPayInfo();
        // description = description + " " + this._deskInfoNumberOfGame();

        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend:description:", id, description, title);
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android
            var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", str, id, description, title);
        }
    },

    //分享到朋友圈
    shareHallTimeline: function shareHallTimeline() {
        if (!cc.sys.isNative) {
            var wxBg = this.shareBg.getChildByName("wx");
            var pyqBg = this.shareBg.getChildByName("PYQ");
            wxBg.active = false;
            pyqBg.active = true;
            this.shareBg.active = true;
        } else {
            var id = sId;
            var title = sTitle;
            var description = sDescription;

            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallTimeline", id, description, title);
            } else {
                //Android
                var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
                jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallTimeline", str, id, description, title);
            }
        }
    },

    //点击准备按钮
    clickReady: function clickReady() {
        this.btnReady.node.active = false;
        this.btnShare.node.active = false;
        this.timeStop();
        Socket.sendReady(this._userId);
    },

    //点击开始按钮
    clickStartGame: function clickStartGame() {
        this.btnReady.node.active = false;
        this.btnShare.node.active = false;
        this.btnStartGame.node.active = false;
        Socket.sendStartGame(this._userId);
    },

    updateRoomNumber: function updateRoomNumber(roomNumber) {
        var gameNumberString = "";
        if (this._deskInfo.setting1 != 0 && this._deskInfo.setting1 != 1) {
            gameNumberString = "局数 : " + "" + this._deskInfo.cIndex + "/" + this._deskInfo.mMax;
        } else if (this._deskInfo.setting1 == 0) {
            gameNumberString = "局数 : 10局";
        } else if (this._deskInfo.setting1 == 1) {
            gameNumberString = "局数 : 20局";
        }
        this.labelRoomNumber.string = "房号 : " + "" + roomNumber + "    " + gameNumberString;
    },

    updateGameStatus: function updateGameStatus() {
        var status = arguments.length <= 0 || arguments[0] === undefined ? GAMESTATUS.WAIT_PEOPLE : arguments[0];

        this._gameStatus = status;

        this.btnShare.node.active = status == GAMESTATUS.WAIT_PEOPLE;
        this.btnReady.node.active = status == GAMESTATUS.WAIT_READY;
        this.isReadyStatus();
    },

    gameStatus: function gameStatus() {
        return this._gameStatus;
    },
    isReadyStatus: function isReadyStatus() {
        if (this._playerInfos && this._playerInfos.length > 0) {
            this._playerInfos.forEach((function (playerInfo) {
                var userInfoSelf = cc.find('Canvas/playSelf/userInfoSelf');
                if (playerInfo.id == this._userId) {
                    if (!playerInfo.readyStatus && !this._isComparingCardsNow && !Playback.instance.isPlaybacking() && !Playback.instance.isContainPlaybackDatas()) {
                        userInfoSelf.getComponent('userInfo').setReadyNodeVisible(false);
                        if (this._deskInfo.cIndex == 0) {
                            //一局还没开始
                            this.btnReady.node.active = false;
                            if (this._deskInfo.players.length < this._deskInfo.maxNumber) {
                                this.btnShare.node.active = true;
                            } else {
                                this.btnShare.node.active = false;
                            }

                            if (this._deskInfo.players.length >= 2 && this._deskInfo.createId == this._userId) {
                                //是否是房主
                                this.btnStartGame.node.active = true;
                            } else {
                                this.btnStartGame.node.active = false;
                            }
                        } else {
                            this.btnReady.node.active = true;
                            this.btnShare.node.active = false;
                            this.btnStartGame.node.active = false;
                            this.btnStartGame.node.active = false;
                        }
                    } else {
                        this.btnReady.node.active = false;
                        this.btnShare.node.active = false;
                        this.btnStartGame.node.active = false;
                        if (!this._isComparingCardsNow) {
                            userInfoSelf.getComponent('userInfo').setReadyNodeVisible(true);
                        } else {
                            this._playerComponents.forEach(function (playerComp) {
                                playerComp.hideReadyStatus();
                            });
                        }
                    }
                }
                //console.log(this._isComparingCardsNow)
                //console.log("准备状态--------")
                if (this._isComparingCardsNow) {
                    //
                    this._playerComponents.forEach(function (playerComp) {
                        playerComp.hideReadyStatus();
                    });
                }
            }).bind(this));
        }
    },

    isGameStart: function isGameStart() {
        if (this._deskInfo.cIndex == 0) {
            //一局还没开始
            if (this._deskInfo.createId == this._userId) {
                //是否是房主
                if (!this._isComparingCardsNow && !Playback.instance.isPlaybacking() && !Playback.instance.isContainPlaybackDatas() && this._deskInfo.players.length >= 2) {
                    this.btnStartGame.node.active = true;
                    this.btnReady.node.active = false;
                } else {
                    this.btnStartGame.node.active = false;
                }
            } else {
                this.btnStartGame.node.active = false;
            }

            if (this._deskInfo.players.length < this._deskInfo.maxNumber) {
                this.btnShare.node.active = true;
            } else {
                this.btnShare.node.active = false;
            }
        } else {
            this.btnStartGame.node.active = false;
            this.btnShare.node.active = false;
        }
    },

    /// 游戏动画
    _startGame: function _startGame(playMusic) {

        if (this.gameStatus() == GAMESTATUS.PLAYING) {
            return;
        }
        //this._playerInfos = players;
        //this._playerComponents.forEach(function (player) {
        //
        //});
        this._playerComponents.forEach(function (playerComp) {
            playerComp.reset(); //#####
            playerComp.hideReadyStatus();
        });
        this.teShuPai.active = false;

        this.unscheduleAllCallbacks();

        this.playsCoins.forEach(function (no) {
            if (no) no.removeAllChildren();
        });

        this._playerComponents.forEach((function (plays, i) {

            var name = "coins" + i;

            var node = this.node.getChildByName(name);

            if (node) {
                node.removeAllChildren();
                this.node.removeChild(node);
            }
        }).bind(this));
        // cc.log(this.node)
        // cc.log('------709')
        this._updateUserInfos(this._playerInfos);
        this.showCompareCard();
        this._isComparingCardsNow = true;
        this.updateGameStatus(GAMESTATUS.PLAYING);
        this._playFaPaiAnimation(playMusic);

        var cardTypeCombine = this.cardTypeCombineNode.getComponent('CardTypeCombine');

        cardTypeCombine.reset();

        cardTypeCombine.node.active = false;

        if (!UserModelHelper.isPlayedCards(this._findPlayerInfoByUserId(this._userId))) {
            this.node.getComponent("animation").fapaiAnimation();
            this.scheduleOnce((function () {
                this._showCardTypeCombine();
            }).bind(this), 1.9);
        }
    },

    _playFaPaiAnimation: function _playFaPaiAnimation(playMusic) {
        this._playerComponents.forEach(function (player) {
            player.playFaPaiAnimation();
        });
        if (playMusic) {
            AudioManager.instance.playFaPai();
        }
    },

    /*#####*/
    //是否特殊牌
    isTeShuPai: function isTeShuPai(cards) {
        var result = KQCard.isTeShuPai(cards);
        if (result) {
            TESHUPAITYPE.isTeShuPai = true;
        } else {
            TESHUPAITYPE.isTeShuPai = false;
        }
        return result;
    },
    //是否一条龙
    isYiTiaoLong: function isYiTiaoLong(cards) {
        var result = KQCard.isYiTiaoLong(cards);
        if (result) {
            TESHUPAITYPE.isYiTiaoLong = true;
        } else {
            TESHUPAITYPE.isYiTiaoLong = false;
        }
        return result;
    },
    //是否六对半
    isLiuDuiBan: function isLiuDuiBan(cards) {
        var result = KQCard.isLiuDuiBan(cards);
        if (result) {
            TESHUPAITYPE.isLiuDuiBan = true;
        } else {
            TESHUPAITYPE.isLiuDuiBan = false;
        }
    },
    //是否三顺子
    isSanShunZi: function isSanShunZi(cards) {
        var result = KQCard.isSanShunZi(cards);
        if (result) {
            TESHUPAITYPE.isSanShunZi = true;
        } else {
            TESHUPAITYPE.isSanShunZi = false;
        }
    },
    //是否三同花
    isSanTongHua: function isSanTongHua(cards) {
        var result = KQCard.isSanTongHua(cards);
        if (result) {
            TESHUPAITYPE.isSanTaoHua = true;
        } else {
            TESHUPAITYPE.isSanTaoHua = false;
        }
    },
    //是否三同花顺
    isSanTongHuaShun: function isSanTongHuaShun(cards) {
        var result = KQCard.isSanTongHuaShun(cards);
        if (result) {
            TESHUPAITYPE.isSanTongHuaShun = true;
        } else {
            TESHUPAITYPE.isSanTongHuaShun = false;
        }
    },
    //是否是清龙
    isQingLong: function isQingLong(cards) {
        var result = KQCard.isQingLong(cards);
        if (result) {
            TESHUPAITYPE.isQingLong = true;
        } else {
            TESHUPAITYPE.isQingLong = false;
        }
    },
    //是否是 “三分天下”
    isSanFenTianXia: function isSanFenTianXia(cards) {
        var result = KQCard.isSanFenTianXia(cards);
        if (result) {
            TESHUPAITYPE.isSanFenTianXia = true;
        } else {
            TESHUPAITYPE.isSanFenTianXia = false;
        }
    },
    //是否是 “四套三条”
    isSiTaoSanTiao: function isSiTaoSanTiao(cards) {
        var result = KQCard.isSiTaoSanTiao(cards);
        if (result) {
            TESHUPAITYPE.isSiTaoSanTiao = true;
        } else {
            TESHUPAITYPE.isSiTaoSanTiao = false;
        }
    },
    //是否是五对三条
    isWuDuiSanTiao: function isWuDuiSanTiao(cards) {
        var result = KQCard.isWuDuiSanTiao(cards);
        if (result) {
            TESHUPAITYPE.isWuDuiSanTiao = true;
        } else {
            TESHUPAITYPE.isWuDuiSanTiao = false;
        }
    },
    //是否是凑一色
    isCouYiSe: function isCouYiSe(cards) {
        var result = KQCard.isCouYiSe(cards);
        if (result) {
            TESHUPAITYPE.isCouYiSe = true;
        } else {
            TESHUPAITYPE.isCouYiSe = false;
        }
    },
    /*#####*/

    /*显示配牌页面*/
    _showCardTypeCombine: function _showCardTypeCombine() {
        if (Playback.instance.isPlaybacking()) {
            return;
        }
        if (this.cardTypeCombineNode.active) {
            return;
        }

        this.startCompareCardsNode.active = false;
        this.btnReady.node.active = false;
        this.btnShare.node.active = false;

        cc.teShuPaiCards = null;

        var cardTypeCombine = this.cardTypeCombineNode.getComponent('CardTypeCombine');
        cardTypeCombine.reset();
        cardTypeCombine.reloadCards([]);
        cardTypeCombine.node.active = true;
        cardTypeCombine.timeStart(60);
        this.timeStart(60, "");
        this.cardTypeCombineNode.scale = 1;

        var cards = this._findCardsByUserId(this._userId);
        //"1_9""3_9""2_9"
        // "2_7""1_7""3_3""2_12"
        //"1_1""1_3""2_6""1_11""2_1""3_4"//
        // if(this._userId == 2){
        //     cards = [{suit: "d", number:2},{suit: "d", number:2}, {suit: "d", number:2},//青龙

        //         {suit: "h", number:2}, {suit: "d", number:2},
        //         {suit: "c", number:3}, {suit: "c", number:3}, {suit: "c", number:3},

        //         {suit: "d", number:3}, {suit: "d", number:4},
        //         {suit: "d", number:4}, {suit: "d", number:4}, {suit: "d", number:4}];
        // }
        //if(this._userId == 1){d
        //    cards = [{suit: "c", number:1},{suit: "h", number:1}, {suit: "s", number:1},//青龙
        //
        //        {suit: "h", number:8}, {suit: "c", number:2},
        //        {suit: "d", number:8}, {suit: "h", number:8}, {suit: "d", number:20},
        //        {suit: "h", number:9}, {suit: "s", number:9},
        //        {suit: "s", number:9}, {suit: "s", number:9}, {suit: "h", number:9}];
        //}
        // else if(this._userId == 6){
        //     cards = [{suit: "d", number:11},{suit: "d", number:13}, {suit: "d", number:11},//青龙
        //         {suit: "d", number:1}, {suit: "d", number:1},
        //         {suit: "h", number:2}, {suit: "h", number:4}, {suit: "h", number:9},
        //         {suit: "s", number:7}, {suit: "s", number:7},
        //         {suit: "s", number:5}, {suit: "s", number:5}, {suit: "s", number:5},];
        // }

        //else if(this._userId == 3){
        //    cards = [{suit: "d", number:4},{suit: "d", number:13}, {suit: "s", number:13},//青龙
        //        {suit: "d", number:6}, {suit: "s", number:7},
        //        {suit: "d", number:8}, {suit: "c", number:9}, {suit: "c", number:10},
        //        {suit: "s", number:1}, {suit: "s", number:3},
        //        {suit: "s", number:10}, {suit: "s", number:8}, {suit: "s", number:12},];
        //}
        cc.moshi = 0;
        for (var i = 0; i < cards.length; i++) {
            var s = cards[i].number;
            if (s >= 20) {
                cc.moshi = 1;
                break;
            }
        }
        var cardNames = this._convertCardsToCardNames(cards);
        cardTypeCombine.reloadCards(cardNames);
        cardTypeCombine.addCardModes(cardNames);

        //cc.from.moshi == 0选择了庄家模式

        if (cc.moshi != 1) {
            this.isTeShuPai(cards);
            this.isQingLong(cards);
            this.isYiTiaoLong(cards);
            this.isLiuDuiBan(cards);
            this.isSanShunZi(cards);
            this.isSanTongHua(cards);
            if (TESHUPAITYPE.isTeShuPai) {
                this.cardTypeCombineNode.scale = 0;
                var nodes = this.gongXiNi.getChildByName("bg");
                nodes.opacity = 240;
            }
            //this.isSanTongHuaShun(cards);
            //this.isSanFenTianXia(cards);
            //this.isSiTaoSanTiao(cards);
            //this.isWuDuiSanTiao(cards);
            //this.isCouYiSe(cards);
            this._showGongXiNiAndBtnTeShuPai();
        }
        cardTypeCombine.cacleAutoSelectedCards2();

        if (cc.moshi == 1) cc.teShuPaiCards = null;
        this._playerComponents.forEach(function (playerComp) {
            playerComp.reset(); //#####
            playerComp.hideReadyStatus();
        });
    },

    getIsTeShuPai: function getIsTeShuPai(userId) {
        var cards = this._findCardsByUserId(userId);
        return this.isTeShuPai(cards);
    },

    /*#####检测特殊牌类型，显示相对应的恭喜你页面和特殊牌精灵*/
    _showGongXiNiAndBtnTeShuPai: function _showGongXiNiAndBtnTeShuPai() {
        /*如果有特殊牌*/
        if (TESHUPAITYPE.isTeShuPai) {
            if (TESHUPAITYPE.isQingLong) {
                this._gongXiNiShow(true, "同花十三水");
                this._sanTongHua = true;
            } else if (TESHUPAITYPE.isYiTiaoLong) {
                this._gongXiNiShow(true, "十三水");
                this._yiTiaoLong = true;
            } else if (TESHUPAITYPE.isLiuDuiBan) {
                this._gongXiNiShow(true, "六对半");
                this._liuDuiBan = true;
            } else if (TESHUPAITYPE.isSanShunZi) {
                this._gongXiNiShow(true, "三顺子");
                this._sanShunZi = true;
            } else if (TESHUPAITYPE.isSanTaoHua) {
                this._gongXiNiShow(true, "三同花");
                this._sanTongHua = true;
            }
            //else if(TESHUPAITYPE.isSanTongHuaShun){
            //    this._gongXiNiShow(true);
            //    this._SanTongHuaShun = true;
            //}
            //else if(TESHUPAITYPE.isSanFenTianXia){
            //    this._gongXiNiShow(true);
            //    this._SanFenTianXia = true;
            //}
            //else if(TESHUPAITYPE.isCouYiSe){
            //    this._gongXiNiShow(true);
            //    this._CouYiSe = true;
            //}
            //else if(TESHUPAITYPE.isSiTaoSanTiao){
            //    this._gongXiNiShow(true);
            //    this._SiTaoSanTiao = true;
            //}
            //else if(TESHUPAITYPE.isWuDuiSanTiao){
            //    this._gongXiNiShow(true);
            //    this._WuDuiSanTiao = true;
            //}
            else {
                    this._gongXiNiShow(false);
                }
        }
        //this._initTeShuPaiSprite();
    },

    /*#####控制特殊牌精灵的显示*/
    _initTeShuPaiSprite: function _initTeShuPaiSprite() {
        /*把所有的特殊牌精灵都隐藏掉*/
        //for(var i=0;i<this.teshupai_min.length;i++){
        //    this.teshupai_min[i].active = false;
        //    this.teshupai_max[i].active = false;
        //}
        ///*如果是一条龙，就显示一条龙的精灵*/
        //if(this._yiTiaoLong){
        //    this.teshupai_min[3].active = true;
        //    this.teshupai_max[3].active = true;
        //}
        ///*如果是六对半就显示六对半的精灵*/
        //else if(this._liuDuiBan){
        //    this.teshupai_min[0].active = true;
        //    this.teshupai_max[0].active = true;
        //}
        ///*如果是三顺子就显示三顺子的精灵*/
        //else if(this._sanShunZi){
        //    this.teshupai_min[1].active = true;
        //    this.teshupai_max[1].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._sanTongHua){
        //    this.teshupai_min[2].active = true;
        //    this.teshupai_max[2].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._QingLong){
        //    this.teshupai_min[4].active = true;
        //    this.teshupai_max[4].active = true;
        //}_gongXiNiShow
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._SanTongHuaShun){
        //    this.teshupai_min[5].active = true;
        //    this.teshupai_max[5].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._SanFenTianXia){
        //    this.teshupai_min[6].active = true;
        //    this.teshupai_max[6].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._CouYiSe){
        //    this.teshupai_min[7].active = true;
        //    this.teshupai_max[7].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._SiTaoSanTiao){
        //    this.teshupai_min[8].active = true;
        //    this.teshupai_max[8].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._WuDuiSanTiao){
        //    this.teshupai_min[9].active = true;
        //    this.teshupai_max[9].active = true;
        //}
    },

    /*#####*/
    //显示gongXiNi 页面和teShuPai
    clickGongXiNiShow: function clickGongXiNiShow() {
        this.cardTypeCombineNode.scale = 1;
        var nodes = this.gongXiNi.getChildByName("bg");
        nodes.opacity = 0;
    },

    _gongXiNiShow: function _gongXiNiShow(statues) {
        var test = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

        //var alterCom = this.gongXiNi.getComponent("alert");
        var alterCom = this.gongXiNi.getComponent('alert');
        alterCom.unscheduleAllCallbacks();
        test = "是否按特殊牌型[" + test + "]出牌？" + "\n" + "(取消后点击左下角可再报道)";
        alterCom.setMessage(test);
        if (statues) {
            alterCom.alert();
        } else {
            alterCom.dismissAction();
        }
        this.teShuPai.active = statues;
        var nodes = this.teShuPai.getChildByName("btnTeshupai");
        nodes.children[0].runAction(cc.repeatForever(cc.rotateBy(1, -360)));
        nodes.children[1].runAction(cc.repeatForever(cc.rotateBy(1, 360)));
    },
    /*#####*/

    //  结果相关
    // 显示一局结果
    _showOneGameResult: function _showOneGameResult() {
        /**/
        this._isComparingCardsNow = false;
        /**/
        this.updateGameStatus(GAMESTATUS.WAIT_PEOPLE);
        //let oneGameResult = this.oneGameResult.getComponent('GameResult');
        //oneGameResult.unscheduleAllCallbacks();
        //oneGameResult.showResults(this._deskInfo, this._userId);
        this._updateUserScores();
        //this._updateBanker();
        //
        var self = this;
        this.scheduleOnce(function () {
            //self._playerComponents.forEach(function (playerComp) {
            //  //playerComp.reset();
            //  //playerComp.reset2();  //#####
            //});

            if (!self._isRandomRoom()) {
                //if (self._deskInfo.cIndex == 0) {//一局还没开始
                //    self.btnReady.node.active = true;
                //}
                if (self._isTotalGameOver()) {
                    self._showTotalGameResult();
                }
            }
        }, 0.5);

        if (this._isRandomRoom() || Playback.instance.isPlaybacking()) {
            this.scheduleOnce(function () {
                oneGameResult.getComponent('alert').dismissAction();
                cc.director.loadScene('hall');
            }, 2);
            return true;
        }
    },

    // 显示总结果
    _showTotalGameResult: function _showTotalGameResult() {
        var showDelay = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];

        this.timeStop();
        //cc.find("Canvas/show_result").active = false;
        this.btnReady.node.active = false;
        this.btnShare.node.active = false;
        this.alertAnsowerExitNode.active = false;
        this.alertRequestExitNode.active = false;
        if (this._deskInfo.cIndex == this._deskInfo.mMax) {
            this.againBtn.active = true;
        } else {
            this.againBtn.active = false;
        }

        var totalGameResultComp = this.totalGameResult.getComponent('TotalGameResult');
        if (totalGameResultComp.node.active) {
            return;
        }

        if (this._bigRecordInfo == null) {
            this._bigRecordInfo = this._deskInfo.players;
        }
        totalGameResultComp.setPlayerInfos(this._bigRecordInfo, this._deskInfo);

        var alert = this.totalGameResult.getComponent('alert');
        this.scheduleOnce((function () {
            //this.oneGameResult.active = false;
            //alert.alert();
            /**/
            if (!this.totalGameResult.active) {
                alert.alert();
            }
            /**/
        }).bind(this), showDelay);

        alert.setDismissCallback(function () {
            Socket.sendOnceAgain('false', this._userId);
            //cc.director.loadScene('hall');
        });
    },
    clickAgain: function clickAgain() {
        Socket.sendOnceAgain('true', this._userId);
    },

    // MARK: Socket 相关
    _loadDeskInfo: function _loadDeskInfo() {
        Socket.sendGetDesckInfo(this._userId);
    },
    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.ReceiveDeskInfo, this._socketReceiveDeskInfo, this);
        KQGlobalEvent.on(Socket.Event.ReceiveOnlineStatus, this._socketReciveOnlineStatus, this);
        KQGlobalEvent.on(Socket.Event.ReceiveChatText, this._socketReciveChatTextMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceiveChatEmoji, this._socketReciveChatEmojiMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceiveRequestDissolve, this._socketReceiveRequestExitMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceiveRequestDissolveResult, this._socketReceiveRequestExitResultMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceiveAudioMessage, this._socketReceiveAudioMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceivePlayCard, this._socketReceivePlayCard, this);
        KQGlobalEvent.on(Socket.Event.ReceiveGameOver, this._socketReceiveGameOver, this);
        KQGlobalEvent.on(Socket.Event.ReceiveFaPai, this._socketReciveFaPai, this);
        KQGlobalEvent.on(Socket.Event.ReceiveReady, this._socketReciveReady, this);
        KQGlobalEvent.on(Socket.Event.ReceiveDissolveDesk, this._socketReceiveDissolveDesk, this);
        KQGlobalEvent.on(Socket.Event.ReceiveLeaveDesk, this._socketLeaveDesk, this);
        KQGlobalEvent.on(Socket.Event.SocketDisconnect, this._receiveSocketConnectError, this);
        KQGlobalEvent.on(Socket.Event.SocketConnectSuccessed, this._receiveSocketConnectSuccessed, this);
        KQGlobalEvent.on(Socket.Event.ReceivePause, this._socketReceivePause, this);
        KQGlobalEvent.on(Socket.Event.ReceiveSelectBeiLv, this._ReceiveSelectBeiLv, this);
        KQGlobalEvent.on(Socket.Event.ReceiveBeiLv, this._ReceiveBeiLv, this);
        KQGlobalEvent.on(Socket.Event.ReceiveQingLi, this._ReceiveQingLi, this);
        KQGlobalEvent.on(Socket.Event.ReceiveOnceAgain, this._ReceiveOnceAgain, this);
    },

    _ReceiveOnceAgain: function _ReceiveOnceAgain(response) {
        var _this3 = this;

        /**
         * 再来一局
         * 总结果要隐藏掉
         * 比牌要隐藏掉
         * 发牌要显示
         */
        this._playedCompareCardsIndexs = [];
        this.playerComps.forEach(function (playerComp) {
            playerComp.playedCompareCardsIndexs = _this3._playedCompareCardsIndexs;
        });
        var data = response.data;
        if (!data.reason) {
            this.totalGameResult.active = false;
            this.startCompareCardsNode.active = false;
            this._playerComponents.forEach(function (playerComp) {
                playerComp.reset(); //#####
            });
            this._socketReceiveDeskInfo(response);
        } else {
            var now = Date.now();
            if (now - this._nowTimeAgain > 1500) {
                this._nowTimeAgain = now;
                this.alertAnsowerExitResult.y = -143;
                this.alertAnsowerExitResult.opacity = 255;
                this.alertAnsowerExitResult.children[0].getComponent(cc.Label).string = '房卡不足';
                var action = cc.spawn(cc.moveTo(0.3, cc.p(0, 20)), cc.fadeOut(0.3));
                this.alertAnsowerExitResult.runAction(cc.sequence(cc.moveTo(1, cc.p(0, 0)), action));
            }
        }
    },

    _ReceiveSelectBeiLv: function _ReceiveSelectBeiLv() {
        if (this._deskInfo.createId != this._userId) {
            this.beilv.active = true;
            var B3 = this.beilv.getChildByName('bg').getChildByName('btn3').getComponent(cc.Button);
            if (this._deskInfo.setting5 == 1) {
                /**
                 * 庄家选择两倍的时候 3倍按钮是不能响应的
                 * 选择三倍不用管，全部显示，
                 * 选择一倍也不用管，直接发牌，
                 */
                B3.interactable = false;
            }
            var selectBl = this.beilv.getComponent('selectBeilv');
            selectBl._userid = this._userid;
        }
    },

    _ReceiveBeiLv: function _ReceiveBeiLv(response) {
        var userId = response.data.userId;
        var bl = response.data.beilv;
        this._playerComponents.forEach(function (player) {
            player.showBeilv(userId, bl);
        });
    },

    _ReceiveQingLi: function _ReceiveQingLi(response) {
        var leaveId = response.data.leaveId;
        if (leaveId == this._userId) {
            if (cc.qingli == null) {
                var ql = response.action;
                cc.qingli = '';
                cc.qingli = ql;
            }
            cc.director.loadScene('hall');
        }
    },

    _socketReceiveDeskInfo: function _socketReceiveDeskInfo(response) {
        if (!response.result) {
            cc.error("错误：", response);
            return;
        }
        var data = response.data;

        this._initPlayerComponents(data.playersIndexAyy);
        /*#####添加五同按钮*/
        // cc.moshi = 0;

        // if(data.setting3[1] == true) cc.moshi = 1;  //  ？？？

        cc.maPai = null;

        if (data.maPai.length == 2) cc.maPai = data.maPai[0] + "_" + data.maPai[1];

        cc.huaSe = data.setting3[2];

        cc.chaoShiChuPai = data.setting6;

        cc.duoYiSe = response.data.setting2; //setting2为 4~7 人（0~3）

        this._deskInfo = data;
        this._globalMsg(data);
        this._updatGameOverview(this._deskInfo);
        this.updateRoomNumber(data.roomId);
        this.needCard.string = data.needCard; // 开放需要的房卡
        var playerIndexs = data.playersIndex; // [100049]
        this._injectUserIdToPlayerComponents(playerIndexs);

        var players = data.players;
        this._playerInfos = players;
        this._updateUserInfos(players);
        this._updateUserScores();
        this._updateBanker();
        this._msgControl.addPlayerInfos(this._playerInfos);

        var currentUserInfo = players.find((function (playerInfo) {
            return playerInfo.id == this._userId;
        }).bind(this));

        if (data.createId == this._userId) {
            if (data.cIndex > 0) {
                // 开始游戏了，请离按钮全部隐藏
                this._playerComponents.forEach(function (player) {
                    player.showQingli(false, data.cIndex);
                });
            } else {
                // 游戏没开始，房主的请离按钮不显示
                this._playerComponents.forEach(function (player) {
                    if (data.createId == player.userId) {
                        // 我是房主，不显示我的请离按钮
                        player.showQingli(true, data.cIndex);
                    } else {
                        player.showQingli(false, data.cIndex);
                    }
                });
            }
        }

        this._playerComponents.forEach(function (player) {
            if (data.createId == player.userId) {
                //显示房主
                player.showFangZhuStatus(data.createId, true);
            } else {
                player.showFangZhuStatus(player.userId, false);
            }
        });

        if (this._deskInfo.createId != this._userId) {
            // 非庄家
            if (this._deskInfo.cIndex == 0) {
                // 如果还没开始游戏，显示退出按钮，隐藏解散按钮
                this.exit.active = true;
                this.Dissolve.active = false;
            } else {
                // 反之
                this.exit.active = false;
                this.Dissolve.active = true;
            }
        } else {
            // 庄家
            if (this._deskInfo.cIndex > 0) {
                // 开局了 隐藏退出按钮
                this.exit.active = false;
                this.Dissolve.active = true;
            } else {
                // 没开局 两个都显示
                this.exit.active = true;
                this.Dissolve.active = true;
            }
        }

        if (!this._deskInfo.isCBegin) {
            this._gameStatus = GAMESTATUS.WAIT_READY;
        }
        for (var i = 0; i < players.length; i++) {
            var s = players[i];
            var is = s.readyStatus; //true/false
            var userId = s.id;
            this._playerComponents.forEach((function (player) {
                if (!this._deskInfo.isCBegin) player.showReadyStatus(userId, is);
            }).bind(this));
        }
        if (currentUserInfo && currentUserInfo.cards.length > 0 && this._deskInfo.isCBegin) {
            if (!currentUserInfo.cardInfo.length) {
                this._startGame(true);
            } else {
                this._startGame(false);
            }
        } else if (UserModelHelper.isPlayedCards(currentUserInfo) && !this._deskInfo.isCBegin) {
            this._socketReceiveGameOver(response);
        }
        this.isReadyStatus();
        this._handleUpdateDeskInfoAboutExitRoom(this._deskInfo);
        this.showCompareCard();
    },

    showCompareCard: function showCompareCard() {
        if (this._deskInfo.cIndex == 0 || this._deskInfo.isCBegin || !this._deskInfo.players || this._deskInfo.players.length <= 0 || this._deskInfo.players[0].cardInfo <= 0) {
            return;
        }

        this.playsCoins.forEach(function (no) {
            if (no) no.removeAllChildren();
        });

        this.unscheduleAllCallbacks();

        this.node.stopAllActions();

        this._playerComponents.forEach(function (playerComp) {
            playerComp.readyToCompareCards();
        });

        this._playerComponents.forEach((function (player) {

            if (player.node.active) player.showAllCompareCards(this._deskInfo.players);
        }).bind(this));

        this.startCompareCardsNode.active = false;

        this._isComparingCardsNow = false;

        this.isReadyStatus();

        this.scheduleOnce((function () {

            if (this._isTotalGameOver()) this._showTotalGameResult();
        }).bind(this), 0.5);
    },

    _socketReciveFaPai: function _socketReciveFaPai(response) {
        //  发牌了开始比牌隐藏掉
        this.startCompareCardsNode.active = false;
        this.timeStop();
        this._isComparingCardsNow = true;
        this._gameStatus = GAMESTATUS.WAIT_READY;
        this._socketReceiveDeskInfo(response);
    },
    logoutAction: function logoutAction() {
        cc.director.loadScene('login');
        manager.setUserInfo('');
        //hall.cacheImageInfo = null;
    },
    _socketReciveOnlineStatus: function _socketReciveOnlineStatus(response) {
        //{"action":"sendOnlineStatus","result":true,"data":{"userId":100049,"status":1}}
        if (!response.result) {
            cc.error("错误：", response);
            return;
        }

        var data = response.data;
        var userId = data.userId;
        var status = data.status;

        this._playerComponents.forEach(function (player) {
            player.setUserOnlineStatus(userId, status);
        });
    },

    _socketReciveChatTextMessage: function _socketReciveChatTextMessage(response) {
        var userId = response.data.userId;
        var message = response.data.msg;

        this._playerComponents.forEach(function (player) {
            player.showChatText(userId, message);
        });

        this._msgControl.addChatTextMessage(userId, message);

        var sex = this._playerInfos.find(function (user) {
            return user.id == userId;
        }).sex;
        AudioManager.instance.playChatAudio(sex, message);
    },
    _socketReciveChatEmojiMessage: function _socketReciveChatEmojiMessage(response) {
        var userId = response.data.userId;
        var emoji = response.data.emoji;

        //this._playerComponents.forEach(function (player) {
        //    player.showChatText(userId, emoji);
        //});
        //this._msgControl.addChatEmojiMessage(userId, emoji);
        this._msgControl._loadEmojiFrame(emoji, (function (frame) {
            this._playerComponents.forEach(function (player) {
                if (player.userId == userId) player.chatMessageNode.getComponent('ChatMessage').showEmoji(frame);
            });
        }).bind(this));
    },

    _socketReceiveRequestExitMessage: function _socketReceiveRequestExitMessage(response) {
        //if (response.data.userId == this._userId) {
        //    return;
        //}

        var alert_bg = this.alertAnsowerExitNode.getChildByName("alert_bg");

        var btnAgree = alert_bg.getChildByName("btnAgree");

        var btnDisagree = alert_bg.getChildByName("btnDisagree");

        btnAgree.active = true;

        btnDisagree.active = true;

        var dataInfos = response.data.info;

        if (!this.alertAnsowerExitNode.active) {

            var alertComp = this.alertAnsowerExitNode.getComponent('alert');

            alertComp.alert();

            alertComp.unscheduleAllCallbacks();

            this.contentAnsowerExitNode.children.forEach(function (i) {
                i.active = false;
            });

            this._playerInfos.forEach((function (playerInfo, index) {

                var play = this.contentAnsowerExitNode.children[index];

                var name = play.getChildByName("nickname");

                var back = play.getChildByName("fanzhu");

                var img = play.getChildByName("avatar_bg");

                play.active = true;

                name.getComponent(cc.Label).string = playerInfo.nickname;

                if (this._deskInfo.createId == playerInfo.id) {
                    //显示房主

                    back.active = true;
                } else {

                    back.active = false;
                }

                cc.loader.load({ url: playerInfo.avatarUrl, type: "jpg" }, (function (err, data) {

                    if (err) return;

                    var frame = new cc.SpriteFrame(data);

                    img.getComponent(cc.Sprite).spriteFrame = frame;
                }).bind(this));
            }).bind(this));

            var countdown = this.alertAnsowerExitCountdownNode.getComponent('Countdown');

            countdown.startCountdown(60, (function (isTimeout) {

                if (isTimeout) {

                    this.clickAgreeOtherPlayerExit();

                    return;
                }
            }).bind(this));
        }

        this._playerInfos.forEach((function (playerInfo, index) {

            var dataInfo = dataInfos[index];

            var play = this.contentAnsowerExitNode.children[index];

            var str = play.getChildByName("id");

            var dataInfo = dataInfos[index];

            if (dataInfo == 1) {

                if (this._userId == playerInfo.id) {
                    //显示房主

                    btnAgree.active = false;

                    btnDisagree.active = false;
                }

                str.getComponent(cc.Label).string = "同意";
            } else {

                str.getComponent(cc.Label).string = "";
            }
        }).bind(this));
    },

    _socketReceiveRequestExitResultMessage: function _socketReceiveRequestExitResultMessage(response) {
        this._hideReqestExitNode();
        if (this.alertAnsowerExitNode.active) {
            this.alertAnsowerExitNode.getComponent('alert').dismissAction();
            this.alertAnsowerExitCountdownNode.getComponent('Countdown').stop();
        }

        if (response.data.result) {
            // 解散成功
        } else {
                var userId = response.data.userId;
                var nickname = this._findPlayerInfoByUserId(userId).nickname;
                this.alertAnsowerExitResult.y = -143;
                this.alertAnsowerExitResult.opacity = 255;
                this.alertAnsowerExitResult.children[0].getComponent(cc.Label).string = nickname + '不同意退出';
                var action = cc.spawn(cc.moveTo(.3, cc.p(0, 20)), cc.fadeOut(this.cardTime));
                this.alertAnsowerExitResult.runAction(cc.sequence(cc.moveTo(1, cc.p(0, 0)), action));

                //this.showAlertMessage('解散失败，因为' + nickname + '不同意退出');
            }
    },

    _socketReceiveAudioMessage: function _socketReceiveAudioMessage(response) {
        var userId = response.data.userId;
        this.playSpeakAnimation(userId);

        if (userId == this._userId) {
            return;
        }

        var url = response.data.url;
        this.playAudioUrl(url);
    },

    _socketReceivePlayCard: function _socketReceivePlayCard(response) {
        // 有用户已经准备好了牌
        var userId = response.data[0].userId;
        var cardInfo = response.data[1].card;
        this._deskInfo = response.data[2].s;
        var players = response.data[2].s.players;
        this._playerInfos = players;
        this._updateUserInfos(players);
        this._playerComponents.forEach(function (player) {
            player.playCard(userId, cardInfo);
        });

        if (userId == this._userId) {
            this.cardTypeCombineNode.active = false;
        }
    },
    _getSelfReadyStatus: function _getSelfReadyStatus() {
        var self = this._findPlayerInfoByUserId(this._userId);
        return self.readyStatus;
    },
    _socketReciveReady: function _socketReciveReady(response) {
        var userId = response.data.userId;
        this._playerComponents.forEach((function (player) {
            if (!this._deskInfo.isCBegin) player.showReadyStatus(userId);
        }).bind(this));
    },

    //收到游戏结束
    _socketReceiveGameOver: function _socketReceiveGameOver(response) {
        this.timeStop();
        cc.sys.localStorage.removeItem("timestamp");

        this._hideReqestExitNode();

        // 一局游戏结束
        if (!response.result) {
            cc.error("错误：", response);
            return;
        }
        /**/
        var deskInfo = response.data;
        if (response.action == 'gameOver' && deskInfo.isDeskOver) {

            Socket.sendDidReceiveGameOverAction(this._userId);
        }
        /**/
        this._deskInfo = response.data;

        // 如果是强制解散房间，则直接显示总成绩
        if (this._isDissvledRoom() && !Playback.instance.isPlaybacking()) {
            this._showTotalGameResult(0.1);
            return;
        }

        if (Date.now() - this._enterTime < 1000 * 4) {
            // 刚进来的话，不展示比牌动画
            //  let oneGameResult = this.oneGameResult.getComponent('GameResult');
            //  oneGameResult.unscheduleAllCallbacks();
            //  oneGameResult.showResults(this._deskInfo, this._userId);
            this.isReadyStatus();
            this.btnShare.node.active = false;
            this.btnReady.node.active = true;
            this._playerComponents.forEach(function (playerComp) {
                playerComp.reset();
            });
            /**/
            this._playedCompareCardsIndexs.push(this._deskInfo.cIndex);
            /**/
            return;
        }

        var data = response.data;
        this._deskInfo = data;
        this._bigRecordInfo = data.bigRecordInfo;
        //console.log(data);
        //console.log("-----------------------------------1709");
        this._updatGameOverview(this._deskInfo);
        //let playerIndexs = data.playersIndex; // [100049]

        var players = data.players;
        this._playerInfos = players;
        this._updateUserInfos(players);
        //this._updateRecordInfo(players);

        if (UserModelHelper.isUserReady(this._findCurrentUserInfo())) {
            this._playerComponents.forEach(function (playerComp) {
                playerComp.reset();
            });
        } else {
            this._startCompareCards(response);
        }

        if (Date.now() - this._enterTime < 1000 * 4) {
            this.showCompareCard();
            return;
        }
    },
    // _updateRecordInfo:function(players){

    //     // this._bigRecordInfo.push();
    // },
    _socketReceiveDissolveDesk: function _socketReceiveDissolveDesk(response) {
        this.cardTypeCombineNode.active = false;
        cc.director.loadScene('hall');

        // this.alert.getComponent('alert').setWillDismissCallback(function(){

        //   return true;
        // });

        // let message = "房主已解散房间";
        // if (this._isRandomRoom()) {
        //   message = "有玩家已强制退出房间，游戏结束。本局游戏不会扣除您的钻石。";
        // }

        // this.showAlertMessage(message, false);
    },
    /**/
    _socketLeaveDesk: function _socketLeaveDesk(response) {
        if (!response.result) {
            return;
        }

        if (this._deskInfo.isDeskOver) {
            // 如果房间已结束，也不用再自动退回到大厅了
            return;
        }

        cc.director.loadScene('hall');
    },
    /**/
    // socket 收到有人手机进入后台消息
    _socketReceivePause: function _socketReceivePause(response) {
        if (!response.result) {
            return;
        }

        var userId = response.data.userId;
        this._playerComponents.forEach(function (player) {
            if (player.userId == userId) {
                player.setUserOnlineStatus(userId, 0);
            }
        });
    },

    _receiveSocketConnectError: function _receiveSocketConnectError(response) {
        this.showNetworkMessage();
    },

    _receiveSocketConnectSuccessed: function _receiveSocketConnectSuccessed(response) {
        this.hiddenNetworkMessage();

        if (!Playback.instance.isPlaybacking()) {
            this._loadDeskInfo();
        }
    },
    /**/
    // MARK: 更新房间信息
    updateDeskInfo: function updateDeskInfo(deskInfo) {
        this._deskInfo = deskInfo;
        this._updatGameOverview(this._deskInfo);
        this.updateRoomNumber(deskInfo.roomId);

        var playerIndexs = deskInfo.playersIndex; // [100049]
        this._injectUserIdToPlayerComponents(playerIndexs);

        var players = deskInfo.players;
        this._playerInfos = players;
        this._updateUserInfos(players);
        this._msgControl.addPlayerInfos(this._playerInfos);
        if (deskInfo.cIndex == 0 && this._deskInfo.players.length < this._deskInfo.maxNumber) {
            this.btnShare.node.active = true;
        }
    },
    /**/
    _injectUserIdToPlayerComponents: function _injectUserIdToPlayerComponents(playerIndexs) {
        var currentUserIdIndex = playerIndexs.findIndex((function (userId) {
            return userId == this._userId;
        }).bind(this));

        var fixedPlayerIndexs = playerIndexs.translationWithStartIndex(currentUserIdIndex);
        this._playerComponents.forEach(function (playerComponent, index) {
            var userId = fixedPlayerIndexs.length > index ? fixedPlayerIndexs[index] : null;
            playerComponent.userId = userId;
        });
    },

    _updateUserInfos: function _updateUserInfos(userInfos) {
        var self = this;
        this._playerComponents.forEach(function (playerComponent, index) {
            //playerComponent.setDeskInfo(self._deskInfo);
            /**/
            playerComponent.updateDeskInfo(self._deskInfo);
            /**/
            playerComponent.updateUserInfoWithUsers(userInfos);
        });

        //this._handleTheSameOfIPAdress(userInfos);
    },

    _updateUserScores: function _updateUserScores(userInfos) {
        this._playerComponents.forEach(function (player) {
            player.updateScore();
        });
    },

    _updateBanker: function _updateBanker() {
        this._playerComponents.forEach(function (player) {
            player.updateBanker();
        });
    },

    // 私有方法
    _findCardsByUserId: function _findCardsByUserId(userId) {
        var player = this._findPlayerInfoByUserId(userId);

        return player != null ? player.cards : null;
    },

    _findPlayerInfoByUserId: function _findPlayerInfoByUserId(userId) {
        var player = (this._playerInfos || []).find(function (playerInfo) {
            return userId == playerInfo.id;
        });

        return player;
    },

    _findPlayerIndexByUserId: function _findPlayerIndexByUserId(userId) {
        //let index = this._playerComponents.findIndex(function (playerComp) {
        //    return playerComp.userId == userId;
        //});
        var index = this.playerNodes.findIndex(function (node) {
            return node.getComponent('Player').userId == userId;
        });
        return index;
    },

    _findCurrentUserInfo: function _findCurrentUserInfo() {
        return this._findPlayerInfoByUserId(this._userId);
    },

    _convertCardsToCardNames: function _convertCardsToCardNames(cards) {
        // [{"suit":"s","number":10}]
        var suitColorMap = {
            s: 4,
            h: 3,
            c: 2,
            d: 1
        };
        return cards.map(function (card) {
            var cardNumber = card.number;

            // 服务器中的 14 是 A
            if (card.number == 14) {
                cardNumber = 1;
            }
            var color = suitColorMap[card.suit];
            var number = Math.max(Math.min(cardNumber, 21), 1);
            return color + "_" + number;
        });
    },

    // 更新游戏总览信息
    _updatGameOverview: function _updatGameOverview(deskInfo) {
        if (Playback.instance.isPlaybacking()) {
            this.labelOverview.string = "回放";
            return;
        }

        if (this._isRandomRoom()) {
            this.labelOverview.string = "";
            return;
        }
        var bihuase = "不比花色 ";
        var zuozhuang = "不坐庄 ";
        var putong = "普通场 ";
        var wugui = "无鬼 ";
        var maPai = '不买马 ';
        var renshu = "4人不加色 ";
        var card = "平摊";

        //[疯狂场,鬼牌,比花色,坐庄,马牌]
        if (this._deskInfo.setting3[2]) {
            bihuase = "比花色  ";
        }
        if (this._deskInfo.setting3[3]) {
            zuozhuang = "坐庄 ";
        }
        if (this._deskInfo.setting3[0]) {
            putong = "疯狂场  ";
        }
        if (this._deskInfo.setting3[1]) {
            wugui = "有鬼  ";
        }
        if (this._deskInfo.setting3[4]) {
            maPai = "买马";
            var huaSe = "方块";
            var dianShu = 1;
            switch (this._deskInfo.setting7[0]) {//setting7 [1~4,1~13] 表示 [花色，点数]
                case 1:
                    huaSe = "方块";break;
                case 2:
                    huaSe = "梅花";break;
                case 3:
                    huaSe = "红心";break;
                case 4:
                    huaSe = "黑桃";break;
            }
            switch (this._deskInfo.setting7[1]) {
                case 1:
                    dianShu = 'A';break;
                case 2:
                    dianShu = 2;break;
                case 3:
                    dianShu = 3;break;
                case 4:
                    dianShu = 4;break;
                case 5:
                    dianShu = 5;break;
                case 6:
                    dianShu = 6;break;
                case 7:
                    dianShu = 7;break;
                case 8:
                    dianShu = 8;break;
                case 9:
                    dianShu = 9;break;
                case 10:
                    dianShu = 10;break;
                case 11:
                    dianShu = 'J';break;
                case 12:
                    dianShu = 'Q';break;
                case 13:
                    dianShu = 'K';break;
            }
            maPai = huaSe + dianShu + maPai;
        }

        if (this._deskInfo.setting2 == 1) {
            renshu = "5人加一色 ";
        } else if (this._deskInfo.setting2 == 2) {
            renshu = "6人加二色 ";
        } else if (this._deskInfo.setting2 == 3) {
            renshu = "7人加三色 ";
        }
        if (this._deskInfo.setting4 == 1) {
            card = "赢者扣 ";
        } else if (this._deskInfo.setting4 == 2) {
            card = "房主扣 ";
        }

        this.labelOverview.string = "模式 : " + bihuase + zuozhuang + putong + wugui + maPai + "\n" + "其他：" + renshu + card;
        //this.labelOverview.string = "模式 : " + "" + deskInfo.maxNumber + "人" +bihuase+zuozhuang+putong+wugui+maPai;
    },

    // 是否是随机房
    _isRandomRoom: function _isRandomRoom() {
        if (this._deskInfo == null) {
            return true;
        }

        return this._deskInfo.isRandomDesk;
    },

    // 是否所有局数都用完了
    _isTotalGameOver: function _isTotalGameOver() {
        if (this._deskInfo == null) {
            return false;
        }

        if (this._deskInfo.isDeskOver) {
            return true;
        }

        return this._deskInfo.mMax <= this._deskInfo.cIndex;
    },

    // 是否已解散房间
    _isDissvledRoom: function _isDissvledRoom() {
        if (this._deskInfo) {
            return this._deskInfo.dissolveStatus;
        }

        return false;
    },

    _startCompareCards: function _startCompareCards(data) {
        this._isComparingCardsNow = true;
        this._gongXiNiShow(false);
        this._players = data.data.players;
        var user = this._findPlayerInfoByUserId(this._userId);
        if (!this.totalGameResult.active) {
            AudioManager.instance.playStartCompare(user.sex);
        }

        this.startCompareCardsNode.getComponent('alert').alert();
        this._playerComponents.forEach(function (playerComp) {
            playerComp.readyToCompareCards();
        });
        this.unscheduleAllCallbacks();
        this.scheduleOnce((function () {
            this.startCompareCardsNode.active = false;
            this._showCompareCardDetails(data);
        }).bind(this), 1.0);
    },

    _showCompareCardDetails: function _showCompareCardDetails(data) {

        this._playerComponents.forEach(function (playerComp) {
            playerComp.reset();
            playerComp.readyToCompareCards();
        });

        var cardTypeCombine = this.cardTypeCombineNode.getComponent('CardTypeCombine');

        cardTypeCombine.reset();

        cardTypeCombine.node.active = false;

        var comparePlayers1 = this._playerComponents.filter(function (player) {

            if (player.node.active) {

                var user = player.compareCardsNode.getComponent('CompareCards')._user;

                if (!user.isContainExtra) return player.node.active;
            }
        });

        var teShuPlayers = this._playerComponents.filter(function (player) {

            if (player.node.active) {

                var user = player.compareCardsNode.getComponent('CompareCards')._user;

                if (user.isContainExtra) return player.node.active;
            }
        });
        var self = this;
        var duration = this._showCompareCardStep(0, comparePlayers1);

        this.scheduleOnce(function () {
            self._showCompareCardStep(0, comparePlayers1);
        }, duration);

        this.scheduleOnce(function () {
            self._showCompareCardStep(0, comparePlayers1);
        }, duration * 2);

        if (teShuPlayers.length > 0) {
            this.scheduleOnce(function () {
                self._showCompareCardStep(0, teShuPlayers, true);
            }, duration * 3);
        }

        duration = duration * 3 + 0.5;

        for (var i = 0; i < teShuPlayers.length; i++) {

            var user = teShuPlayers[i].compareCardsNode.getComponent('CompareCards')._user;

            if (user.isContainExtra) duration = duration + 2.5;
        }

        var shootDuration = this.headCardTime;

        var shootDatas = this._shootDatas() || [];

        var shotData = this._shotData() || [];

        var homeRunUserId = this._homeRunUserId();

        var shotDataTimes = 0;

        shotData.forEach(function (data, index) {

            self.scheduleOnce(function () {

                self.playShoot(data.fromUserId, data.toUserId);
            }, duration + index * shootDuration);

            shotDataTimes += self.headCardTime;

            duration += self.headCardTime;
        });

        if (homeRunUserId.length >= 1) {

            shootDatas.forEach(function (data, index) {

                self.scheduleOnce(function () {

                    self.playShoot(data.fromUserId, data.toUserId);
                }, duration + (index + shotDataTimes) * shootDuration);

                duration += self.headCardTime;
            });
        }

        duration = duration + shootDatas.length * shootDuration + shotData.length * shootDuration;

        if (homeRunUserId > 0) {

            self.scheduleOnce(function () {
                self.playHomeRun(homeRunUserId);
            }, duration);

            duration = duration + 1;
        }

        if (homeRunUserId) {
            duration = duration + 1;
        }

        //this.scheduleOnce(function () {this._jinBiAction();}.bind(this), duration);//显示结算金币//显示结果
        this._jinBiAction(duration);
        //this.scheduleOnce(function () {
        //
        //    this._playerComponents.forEach(function (playerComp) {playerComp.showScoreResult();});
        //
        //    self._showCompareCardFinished();
        //
        //}.bind(this), duration);
    },

    _jinBiAction: function _jinBiAction(duration) {
        var comparePlayers1 = this._playerComponents.filter(function (player) {
            return player.node.active;
        });

        var nextTime = 0; //下一个动作开始的时间

        var zTime = 0; //下下一个动作开始的时间

        var start = 0;

        var end = 0;

        var coinsContainerAyy = []; //所有的用户的金币 一个用户一个数组

        var coinsAyy = []; //所有的金币，一个数组

        this.playsCoins.forEach(function (no) {
            if (no) no.removeAllChildren();
        });

        comparePlayers1.forEach((function (plays, index) {
            //根据积分创建金币

            var cScore = plays.compareCardsNode.getComponent('CompareCards')._user.cScore;

            if (cScore < 0) {

                cScore *= -1;

                var node = new cc.Node();

                node.name = "coinsContainer";

                var numScore = cScore > 30 ? 30 : cScore;
                for (var i = 0; i < numScore; i++) {
                    this._createJinBiPrefab(node, node); //根据积分创建金币
                }

                this.playsCoins[index].addChild(node);

                coinsContainerAyy.push(node.children);
            }
        }).bind(this));

        this.playsCoins.forEach(function (no) {
            if (no) no.active = false;
        });

        this.scheduleOnce((function () {
            //显示结果

            this.playsCoins.forEach(function (no) {
                if (no) no.active = true;
            });

            AudioManager.instance.coinIncome();

            coinsContainerAyy.forEach((function (coinsAyys) {
                //把金币移动到容器

                var initTime = 0;

                var interval = 0.002;

                coinsAyys.forEach((function (coins) {
                    //把金币移动到容器

                    var y = Math.round(Math.random()) == 0 ? -1 : 1;

                    y = Math.floor(Math.random() * 38) * y;

                    var x = Math.round(Math.random()) == 0 ? -1 : 1;

                    x = Math.floor(Math.random() * 38) * x;

                    var cardBackWorldSpace1 = this.node.convertToWorldSpaceAR(cc.v2(x, y));

                    var v2 = coins.convertToNodeSpaceAR(cardBackWorldSpace1);

                    this.scheduleOnce(function () {

                        coins.runAction(cc.moveBy(0.2, v2));
                    }, initTime);

                    initTime = initTime + interval;
                }).bind(this));

                nextTime = initTime;

                coinsAyy = coinsAyy.concat(coinsAyys); //把金币集合到一个数组
            }).bind(this));

            var zcScore = 0;

            comparePlayers1.forEach((function (plays) {
                //计算金币

                var cScore = plays.compareCardsNode.getComponent('CompareCards')._user.cScore;

                cScore = cScore > 30 ? 30 : cScore;

                if (cScore > 0) zcScore += cScore * 1;
            }).bind(this));

            var coinsAyy1 = coinsAyy.splice(zcScore, coinsAyy.length);

            coinsAyy1.forEach(function (node) {
                node.parent.removeChild(node);
            });

            comparePlayers1.forEach((function (plays) {
                //把金币到用户头像附近

                var cScore = plays.compareCardsNode.getComponent('CompareCards')._user.cScore;

                if (cScore > 0) {

                    var interval = 0.0025;

                    var initTime = nextTime + 1;

                    var numScore = cScore > 30 ? 30 : cScore;

                    //end += numScore;

                    coinsAyy.splice(0, numScore).forEach((function (coinsNode) {
                        //把金币到用户头像附近

                        this.scheduleOnce(function () {

                            //获取节点的世界坐标
                            var cardBackWorldSpace1 = plays.node.convertToWorldSpaceAR(cc.v2(0, 0));
                            //获取相对父节点所在的坐标
                            var detail = coinsNode.convertToNodeSpaceAR(cardBackWorldSpace1);

                            var moveBy = cc.moveBy(0.25, detail);

                            var nextFadeIn = cc.fadeOut(0.13);

                            var moveSeq = cc.sequence(moveBy, nextFadeIn);

                            coinsNode.runAction(moveSeq);
                        }, initTime);

                        initTime = initTime + interval;
                    }).bind(this));

                    //start += cScore;

                    zTime = initTime;
                }
            }).bind(this));

            this.scheduleOnce((function () {
                //显示结果

                //this.playsCoins.forEach(function(no){if(no) no.active = false;});

                this._showCompareCardFinished();

                comparePlayers1.forEach(function (playerComp) {
                    playerComp.showScoreResult();
                });
            }).bind(this), zTime);

            this.scheduleOnce((function () {
                //显示结果

                this.playsCoins.forEach(function (no) {
                    if (no) no.removeAllChildren();
                });
            }).bind(this), zTime + 5);
        }).bind(this), duration);
    },

    _createJinBiPrefab: function _createJinBiPrefab(node, v2Node) {

        var nodes = cc.instantiate(this.coinsPrefab);

        var y = Math.round(Math.random()) == 0 ? -1 : 1;

        y = Math.floor(Math.random() * 38) * y + v2Node.y;

        var x = Math.round(Math.random()) == 0 ? -1 : 1;

        x = Math.floor(Math.random() * 38) * x + v2Node.x;

        nodes.x = x;

        nodes.y = y;

        node.addChild(nodes);
    },

    _showCompareCardStep: function _showCompareCardStep() {
        var startTime = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var comparePlayers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var isContainExtra = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        var duration = startTime;
        var interval = this.headCardTime;
        var teshuTime = 0;
        var self = this;

        comparePlayers = comparePlayers.sort(function (player1, player2) {
            return player1.nextCompareScore() - player2.nextCompareScore();
        });

        var co = comparePlayers;
        //console.log(co)
        //console.log('-------------执行了几次')

        co.forEach(function (player) {

            self.scheduleOnce(function () {
                player.showNextCompareCards();
            }, duration + teshuTime);

            duration = duration + interval;
            var user = player.compareCardsNode.getComponent('CompareCards')._user;
            if (user.isContainExtra) {
                if (user.cardInfo[0].type == 10) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._santonghuaAnimation();
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                } else if (user.cardInfo[0].type == 11) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._sanshunziAnimation();
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                } else if (user.cardInfo[0].type == 12) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._liuduibanAnimation();
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                } else if (user.cardInfo[0].type == 18) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._qinglongAniamtion('long');
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                } else if (user.cardInfo[0].type == 19) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._qinglongAniamtion("ql");
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                }
            }
        });

        if (isContainExtra) {

            for (var i = 0; i < co.length; i++) duration = duration + 2.5;

            this._playerComponents.forEach(function (player) {
                if (player.node.active) {
                    self.scheduleOnce(function () {
                        player.showNextCompareScore(isContainExtra);
                    }, duration - interval);
                }
            });
        } else {
            co.forEach(function (player) {
                self.scheduleOnce(function () {
                    player.showNextCompareScore();
                }, duration - interval);
            });
        }

        return duration + teshuTime;
    },

    _isGameOver: function _isGameOver() {},

    // 比牌完成后会调用的方法
    _showCompareCardFinished: function _showCompareCardFinished() {
        this.timeStart(5, "ready");
        this._showOneGameResult();
        /**/
        this._playedCompareCardsIndexs.push(this._deskInfo.cIndex);
        /**/
    },

    //network
    showNetworkMessage: function showNetworkMessage() {
        var msg = arguments.length <= 0 || arguments[0] === undefined ? "网络链接断开，重新连接中..." : arguments[0];

        if (this.networkNode && this.networkNode.active) {
            return;
        }

        if (this.networkNode != null) {
            var removeSelfAction = cc.removeSelf();
            this.networkNode.runAction(removeSelfAction);
            this.networkNode = null;
        }
        this.networkNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.networkNode);
        var comp = this.networkNode.getComponent('alert');
        var self = this;
        comp.onDismissComplete = function () {
            self.networkNode = null;
        };
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenNetworkMessage: function hiddenNetworkMessage() {
        if (this.networkNode != null) {
            this.networkNode.getComponent('alert').dismissAction();
        }
    },

    showAlertMessage: function showAlertMessage(msg, autoDismiss) {
        var alertComp = this.alert.getComponent('alert');
        if (!this.alert.active) {
            alertComp.alert();
        }

        alertComp.setMessage(msg);
        alertComp.unscheduleAllCallbacks();
        if (autoDismiss) {
            alertComp.scheduleOnce(function () {
                alertComp.dismissAction();
            }, 5);
        }
    },

    //checkNode
    showCheckMessage: function showCheckMessage() {
        var msg = arguments.length <= 0 || arguments[0] === undefined ? '检查网络中...' : arguments[0];

        if (this.checkNode != null) {
            var removeSelfAction = cc.removeSelf();
            this.checkNode.runAction(removeSelfAction);
            this.checkNode = null;
        }
        this.checkNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.checkNode);
        var comp = this.checkNode.getComponent('alert');
        var self = this;
        comp.onDismissComplete = function () {
            self.checkNode = null;
        };
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenCheckMessage: function hiddenCheckMessage() {
        if (this.checkNode != null && this.checkNode.active) {
            this.checkNode.getComponent('alert').dismissAction();
        }
    },

    /////  聊天语音逻辑
    // _registerVoiceNodeEvents: function () {
    //     let self = this;
    //     let chatVoiceNode = this.btnChatVoice.node;
    //     this.endRecordTime = Date.now();
    //     chatVoiceNode.on(cc.Node.EventType.TOUCH_START,function(event) {
    //         if (Date.now() - self.endRecordTime >= 1000) {
    //             self.nativeRecordAction();
    //             //self.voiceRecordAnimationNode.active = true;

    //             let action = cc.scaleTo(0.12, 1.2);
    //             self.btnChatVoice.node.runAction(action);

    //             self._isRecording = true;
    //         }
    //     });
    //     chatVoiceNode.on(cc.Node.EventType.TOUCH_END,function(event) {
    //         if (self._isRecording) {
    //             self.endRecordTime = Date.now();
    //         }
    //         self._isRecording = false;

    //         self.nativeEndRecordAction();
    //         //self.voiceRecordAnimationNode.active = false;

    //         let action = cc.scaleTo(0.12, 1);
    //         self.btnChatVoice.node.runAction(action);
    //     });
    //     chatVoiceNode.on(cc.Node.EventType.TOUCH_CANCEL,function(event) {
    //         if (self._isRecording) {
    //             self.endRecordTime = Date.now();
    //         }
    //         self._isRecording = false;

    //         self.nativeEndRecordAction();
    //         //self.voiceRecordAnimationNode.active = false;

    //         let action = cc.scaleTo(0.12, 1);
    //         self.btnChatVoice.node.runAction(action);
    //     });
    //     Socket.instance.uploadFinish = function(url) {
    //         let userId = self._userId;
    //         Socket.sendAudioMessage(userId, url);
    //         self.playSpeakAnimation(self._userId);
    //     };
    // },

    _registerVoiceNodeEvents: function _registerVoiceNodeEvents() {
        var self = this;
        var chatVoiceNode = this.btnChatVoice.node;
        this.endRecordTime = Date.now();
        chatVoiceNode.on(cc.Node.EventType.TOUCH_START, function (event) {
            // self.VoiceMsgBgAnimation();
            if (!cc.sys.isNative) {
                var runTime = 0.3;
                var tishi = cc.instantiate(self.autoTishi);
                self.node.addChild(tishi);
                var action = cc.spawn(cc.moveTo(0.3, cc.v2(0, 0)), cc.fadeIn(0.3));
                tishi.runAction(action);
                self.scheduleOnce((function () {
                    var finished = cc.callFunc(function () {
                        tishi.removeFromParent(true);
                    });
                    var action = cc.sequence(cc.spawn(cc.fadeOut(runTime), cc.moveTo(runTime, cc.v2(0, 50))), finished);
                    tishi.runAction(action);
                }).bind(this), 1.5);
                //var url = "www.baidu.com";
                //let userId = self._userId;
                //Socket.sendAudioMessage(userId, url);
            } else {
                    if (Date.now() - self.endRecordTime >= 1000) {
                        self.VoiceMsgBgAnimation();
                        self.nativeRecordAction();
                        var _action = cc.scaleTo(0.12, 1.2);
                        self.btnChatVoice.node.runAction(_action);
                        self._isRecording = true;
                    }
                }
        });
        chatVoiceNode.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.VoiceMsgBg.active = false;
            if (self._isRecording) {
                self.endRecordTime = Date.now();
            }
            self._isRecording = false;

            self.nativeEndRecordAction();
            //self.voiceRecordAnimationNode.active = false;

            var action = cc.scaleTo(0.12, 1);
            self.btnChatVoice.node.runAction(action);
        });
        chatVoiceNode.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.VoiceMsgBg.active = false;
            if (self._isRecording) {
                self.endRecordTime = Date.now();
            }
            self._isRecording = false;

            self.nativeEndRecordAction();
            //self.voiceRecordAnimationNode.active = false;

            var action = cc.scaleTo(0.12, 1);
            self.btnChatVoice.node.runAction(action);
        });
        Socket.instance.uploadFinish = function (url) {
            var userId = self._userId;
            Socket.sendAudioMessage(userId, url);
            self.playSpeakAnimation(self._userId);
        };
    },
    VoiceMsgBgAnimation: function VoiceMsgBgAnimation() {
        this.VoiceMsgBg.active = true;
        var whileLayout = this.VoiceMsgBg.getChildByName("whileLayout");
        var childWhile = whileLayout.getChildByName("childWhile");
        if (this.whileLayoutInterval) {
            clearInterval(this.whileLayoutInterval);
        }

        this.whileLayoutInterval = setInterval(function () {
            var node = cc.instantiate(childWhile);
            if (whileLayout.children.length > 5) {
                whileLayout.removeAllChildren();
            }
            whileLayout.addChild(node);
        }, 200);

        var layout = this.VoiceMsgBg.getChildByName("layout");
        var cWhile = layout.getChildByName("while");

        if (this.layoutInterval) {
            clearInterval(this.layoutInterval);
        }

        this.layoutInterval = setInterval(function () {
            var node = cc.instantiate(cWhile);
            if (layout.children.length > 3) {
                layout.removeAllChildren();
            }
            layout.addChild(node);
        }, 300);
    },
    nativeRecordAction: function nativeRecordAction() {
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "record");
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android com.lling.qianjianglzg
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "record", "()V");
            AudioManager.instance.pauseMusic();
        }
    },

    nativeEndRecordAction: function nativeEndRecordAction() {
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "endRecord");
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "endRecord", "()V");
            AudioManager.instance.resumeMusic();
        }
    },

    playAudioUrl: function playAudioUrl(url) {
        //console.log("---------------------------2553");
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "playUrl:", url);
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "playUrl", "(Ljava/lang/String;)V", url);
        }
    },

    // MARK:  退出游戏逻辑
    _handleUpdateDeskInfoAboutExitRoom: function _handleUpdateDeskInfoAboutExitRoom(deskInfo) {
        if (!deskInfo.isDissolving) {
            return;
        }
        var dataInfos = deskInfo.dissolveAnswerInfo;

        var alertComp = this.alertAnsowerExitNode.getComponent('alert');

        alertComp.alert();

        alertComp.unscheduleAllCallbacks();

        this.contentAnsowerExitNode.children.forEach(function (i) {
            i.active = false;
        });

        this._playerInfos.forEach((function (playerInfo, index) {

            var play = this.contentAnsowerExitNode.children[index];

            var name = play.getChildByName("nickname");

            var back = play.getChildByName("fanzhu");

            var img = play.getChildByName("avatar_bg");

            var str = play.getChildByName("id");

            var dataInfo = dataInfos[index];

            play.active = true;

            name.getComponent(cc.Label).string = playerInfo.nickname;

            if (this._deskInfo.createId == playerInfo.id) {
                //显示房主

                back.active = true;
            } else {

                back.active = false;
            }

            cc.loader.load({ url: playerInfo.avatarUrl, type: "jpg" }, (function (err, data) {

                if (err) return;

                var frame = new cc.SpriteFrame(data);

                img.getComponent(cc.Sprite).spriteFrame = frame;
            }).bind(this));

            if (dataInfo == 1) {

                str.getComponent(cc.Label).string = "同意";
            } else {

                str.getComponent(cc.Label).string = "";
            }
        }).bind(this));

        var dissolveLeftTime = deskInfo.dissolveLeftTime || 60;

        var countdown = this.alertAnsowerExitCountdownNode.getComponent('Countdown');

        countdown.startCountdown(dissolveLeftTime, (function (isTimeout) {

            if (isTimeout) {
                this.clickAgreeOtherPlayerExit();
                return;
            }
        }).bind(this));

        var dissolveUserId = deskInfo.dissolveUserId;

        if (dissolveUserId == this._userId) {

            var alert_bg = this.alertAnsowerExitNode.getChildByName("alert_bg");

            var btnAgree = alert_bg.getChildByName("btnAgree");

            var btnDisagree = alert_bg.getChildByName("btnDisagree");

            btnAgree.active = false;

            btnDisagree.active = false;
            //this.alertRequestExitNode.active = true;
            //this.btnAlertRequestExitCancelButton.node.active = false;
            //this.btnAlertRequestExitConfirmButton.node.active = false;
            //let alert = this.alertRequestExitNode.getComponent('alert');
            //alert.setMessage("您正在申请协商退出，等待其他玩家同意");
            //this.alertRequestExitCountdownNode.getComponent('Countdown').startCountdown(dissolveLeftTime);
            return;
        }

        //let dissolveAnswerInfos = deskInfo.dissolveAnswerInfo;
        //let currentUserIdIndex = deskInfo.playersIndex.findIndex(function(userId) {
        //    return this._userId == userId;
        //}.bind(this));
        //
        //let answerResult = dissolveAnswerInfos[currentUserIdIndex];
        //
        //if (answerResult == -1) {
        //    // -1 表示未处理  0 表示拒绝  1表示同意
        //    this.alertAnsowerExitNode.active = true;
        //
        //    let countdown = this.alertAnsowerExitCountdownNode.getComponent('Countdown');
        //
        //    countdown.startCountdown(dissolveLeftTime, function(isTimeout) {
        //        if (isTimeout) {
        //            this.clickAgreeOtherPlayerExit();
        //        }
        //    }.bind(this));
        //
        //}
    },

    // 确定要强制退出游戏
    clickConfirmForceExit: function clickConfirmForceExit() {
        Socket.sendForceExitRoom(this._userId);
        cc.director.loadScene('hall');
    },

    // 确认请求退出游戏
    clickConfirmRequestExit: function clickConfirmRequestExit() {
        this.btnAlertRequestExitCancelButton.node.active = false;
        this.btnAlertRequestExitConfirmButton.node.active = false;
        var alert = this.alertRequestExitNode.getComponent('alert');
        if (this._deskInfo.cIndex > 0) {
            alert.setMessage("您正在申请协商退出，等待其他玩家同意");
            this.alertRequestExitCountdownNode.getComponent('Countdown').startCountdown(60);
        }
        Socket.sendLeaveDesk(this._userId);
    },

    // 同意他人退出
    clickAgreeOtherPlayerExit: function clickAgreeOtherPlayerExit() {
        //this.alertAnsowerExitNode.getComponent('alert').dismissAction();
        //this.alertAnsowerExitNode.getComponent('alert').unscheduleAllCallbacks();
        //this.alertAnsowerExitCountdownNode.getComponent('Countdown').stop();
        var alert_bg = this.alertAnsowerExitNode.getChildByName("alert_bg");
        var btnAgree = alert_bg.getChildByName("btnAgree");
        var btnDisagree = alert_bg.getChildByName("btnDisagree");
        btnAgree.active = false;
        btnDisagree.active = false;
        Socket.sendAnswerDissolve(this._userId, 1);
    },

    // 不同意他人退出
    clickDisagreeOtherPlayerExit: function clickDisagreeOtherPlayerExit() {
        //this.alertAnsowerExitNode.getComponent('alert').dismissAction();
        //this.alertAnsowerExitNode.getComponent('alert').unscheduleAllCallbacks();
        //this.alertAnsowerExitCountdownNode.getComponent('Countdown').stop();
        var alert_bg = this.alertAnsowerExitNode.getChildByName("alert_bg");
        var btnAgree = alert_bg.getChildByName("btnAgree");
        var btnDisagree = alert_bg.getChildByName("btnDisagree");
        btnAgree.active = false;
        btnDisagree.active = false;
        Socket.sendAnswerDissolve(this._userId, 0);
    },

    // 隐藏请求退出 Node
    _hideReqestExitNode: function _hideReqestExitNode() {
        if (!this.alertRequestExitNode.active) {
            return;
        }

        this.alertRequestExitNode.active = false;
        this.alertRequestExitCountdownNode.getComponent('Countdown').stop();
    },

    //// 打枪
    playShoot: function playShoot(fromUserId, toUserId) {
        var user = this._findPlayerInfoByUserId(fromUserId);
        if (user) {
            AudioManager.instance.playHumanDaQiang(user.sex);
        }

        var toUserIndex = this._findPlayerIndexByUserId(toUserId);

        this._playerComponents.forEach((function (player) {
            if (this._userId == fromUserId || this._userId == toUserId) player.showNextCompareScore();
            player.playShootAnimation(fromUserId, toUserIndex);
            player.playBulletHoleAnimation(toUserId);
        }).bind(this));
    },

    // 播放全垒打动效
    playHomeRun: function playHomeRun(userId) {
        var user = this._findPlayerInfoByUserId(userId);
        if (user) {
            AudioManager.instance.playHomeRun(user.sex);
        }
        this.node.getComponent("animation")._quanleidaAnimation('long');

        this._playerComponents.forEach((function (player) {

            player.showNextCompareScore();
        }).bind(this));
    },

    playSpeakAnimation: function playSpeakAnimation(userId) {
        this._playerComponents.forEach(function (player) {
            player.playSpeakAnimation(userId);
        });
    },

    _shootDatas: function _shootDatas() {
        var homeRunUserId = this._homeRunUserId(); // 全垒打
        var shootDatas = this._deskInfo.shotData.filter(function (data) {
            return data.fromUserId == homeRunUserId;
        });
        return shootDatas;
    },

    _shotData: function _shotData() {
        var homeRunUserId = this._homeRunUserId(); // 打枪
        var shotData = this._deskInfo.shotData.filter(function (data) {
            return data.fromUserId != homeRunUserId;
        });
        return shotData;
    },

    _homeRunUserId: function _homeRunUserId() {
        return this._deskInfo.allShotData;
    },

    // MARK: 房间信息部分

    // 获取房间的玩法
    _deskInfoGameWay: function _deskInfoGameWay() {
        var setting = this._deskInfo.setting3;
        if (setting == null) {
            setting = 2;
        }
        var names = ["庄家模式", "无特殊牌", "普通模式"];
        return names[setting];
    },

    _deskInfoNumberOfGame: function _deskInfoNumberOfGame() {
        var setting = this._deskInfo.setting1;
        var infos = ['10局', '20局', '40局', '5局'];
        /*if (setting <= 1) {
         return '条数：' + infos[setting];
         }*/
        if (setting == 2) {
            setting = 0;
        } else if (setting == 3) {
            setting = 1;
        } else if (setting == 4) {
            setting = 2;
        } else if (setting == 5) {
            setting = 3;
        }
        return '局数：' + infos[setting];
    },

    _deskInfoNumberOfPeople: function _deskInfoNumberOfPeople() {
        var setting = this._deskInfo.setting2;
        var infos = ['2人', '3人', '4人', '5人'];
        return infos[setting];
    },

    _deskInfoPayInfo: function _deskInfoPayInfo() {
        var setting = this._deskInfo.setting4;
        if (setting == null) {
            setting = 0;
        }
        if (setting == 0) {
            setting = 1;
        }
        var infos = ['房主霸主庄', '房费AA'];
        return infos[setting];
    },

    _deskInfoJiaYiSeInfo: function _deskInfoJiaYiSeInfo() {
        var setting = this._deskInfo.setting7 == 0 ? 1 : 0;
        var infos = ['无多一色', '多一色'];
        return infos[setting];
    },

    _deskInfoGuiPaiInfo: function _deskInfoGuiPaiInfo() {
        var setting = undefined;
        if (this._deskInfo.setting8 == null) {
            setting = 0;
        } else if (this._deskInfo.setting8 == 0) {
            setting = 1;
        } else if (this._deskInfo.setting8 == 1) {
            setting = 2;
        }
        var infos = ['无王牌', '两张王牌', '四张王牌'];
        return infos[setting];
    },

    // MARK: 剩余时间
    _remainTimeStartUpdate: function _remainTimeStartUpdate() {
        //this.schedule(this._remainTimeUpdate, 1.0, cc.macro.REPEAT_FOREVER);
    },

    _remainTimeUpdate: function _remainTimeUpdate() {
        if (this._isRandomRoom() || Playback.instance.isPlaybacking()) {
            this.labelRemainTime.string = "";
            this.labelRemainTime.node.active = false;
            return;
        }

        if (this._deskInfo == null) {
            this.labelRemainTime.string = "";
            this.labelRemainTime.node.active = false;
            return;
        }

        var isTaoShu = this._deskInfo.setting1 == 0 || this._deskInfo.setting1 == 1;
        if (isTaoShu) {
            this.labelRemainTime.node.active = false;
            return;
        }

        if (!this._deskInfo.createTime) {
            return;
        }

        this.labelRemainTime.node.active = true;
        var createTime = fecha.parse(this._deskInfo.createTime, 'YYYY-MM-DD HH:mm:ss').getTime();
        var oneHour = 60 * 60;
        var remain = (Date.now() - createTime) / 1000;
        remain = Math.max(oneHour - remain, 0);

        var mins = Math.floor(remain / 60);
        var secs = Math.floor(remain % 60);
        if (mins == 0 && secs == 0) {
            this.labelRemainTime.string = "";
            return;
        }

        var minsString = "" + mins;
        if (minsString.length < 2) {
            minsString = "0" + minsString;
        }

        var secsString = "" + secs;
        if (secsString.length < 2) {
            secsString = "0" + secsString;
        }

        var string = "剩余时间：00:" + minsString + ":" + secsString;
        this.labelRemainTime.string = string;
    },

    // MARK: 处理同 IP 的用户
    _handleTheSameOfIPAdress: function _handleTheSameOfIPAdress(userInfos) {
        if (!userInfos || userInfos.length == 0) {
            return;
        }

        var ipUserInfos = userInfos.reduce(function (ips, userInfo) {
            var users = ips[userInfo.ipAddress] || [];
            users.push(userInfo);

            ips[userInfo.ipAddress] = users;
            return ips;
        }, {});

        var sameIpUsers = null;
        for (var ip in ipUserInfos) {
            var users = ipUserInfos[ip];
            if (users.length > 1) {
                sameIpUsers = users;
                break;
            }
        }

        if (sameIpUsers == null) {
            return;
        }

        this._alertSameIpUserInfos(sameIpUsers);
    },

    _alertSameIpUserInfos: function _alertSameIpUserInfos(users) {
        var message = "";
        var userIds = "";
        users.forEach(function (user, index) {
            message = message + (index > 0 ? ' 和 ' : '') + user.nickname;
            userIds = userIds + user.id;
        });
        message = message + ' 在同一 IP 下！';

        this._didAlertSameIpMessage = this._didAlertSameIpMessage || {};
        if (this._didAlertSameIpMessage[userIds]) {
            return;
        }

        this.showAlertMessage(message, true);
        this._didAlertSameIpMessage[userIds] = true;
    }

});
Play.gongXiNiShow = function (type) {
    this.instances._gongXiNiShow(type);
};
module.exports = Play;