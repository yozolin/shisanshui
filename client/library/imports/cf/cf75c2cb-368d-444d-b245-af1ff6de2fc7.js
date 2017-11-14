var manager = require('manager');
var KQGlobalEvent = require('KQGlobalEvent');
var KQNativeInvoke = require('KQNativeInvoke');

var SocketConstant = {
  MaxReconnectCheckInterval: 5 };

/**
 * 这是对 WebSocket 的一个封装
 * 
 * 里面包含自动重连的功能
 */
// 重连检测时间片
var Socket = cc.Class({
  'extends': cc.Component,

  properties: {
    _lastReceiveMsgTime: 0, // 最后一次收到消息时间(毫秒)
    _timeout: 8 },

  // 超时时长 （秒）
  statics: {
    instance: null,
    // url:"ws://182.18.26.13:5041",
    url: "ws://123.56.20.164:5041"
  },

  // url:"ws://192.168.0.108:5041",
  //url:"ws://183.3.205.149:5002",
  // use this for initialization
  onLoad: function onLoad() {
    Socket.instance = this;

    this.name = "socket";

    cc.game.addPersistRootNode(this.node);
    if (cc.game.isPersistRootNode(this.node)) {
      cc.log('添加全局节点 Socket 成功');
    }

    this._registerAppActiveChange();

    this.isCreating = false;
    this.createIndex = 0;
    this.createSocket();

    this.schedule(function () {
      this.checkConnection();
    }, 5);

    this.recvTime = Date.now(); //接收到最新一条服务器的信息的时间
    //cc.log(manager.version);

    this._checkSocket();
  },

  checkConnection: function checkConnection() {
    //客户端定时给服务端发送点数据，防止连接由于长时间没有通讯而被某些节点的防火墙关闭导致连接断开的情况。
    this.sendMessage('checkAction', '');
  },

  createSocket: function createSocket() {
    var self = this;
    this.createIndex++; //创建次数加1
    if (this.createIndex > 5) {
      this.networkError();
      KQNativeInvoke.forceExitApp();
      return;
    }
    this.isCreating = true;

    KQGlobalEvent.emit(Socket.Event.SocketConnecting);
    this.ws = new WebSocket(Socket.url);
    if (this.ws === null) {
      this.networkError();
      KQGlobalEvent.emit(Socket.Event.SocketConnectError, { 'data': 'Socket 创建失败' });
      KQNativeInvoke.forceExitApp();
      return;
    }
    this.socketError = false;

    // socket 连接成功
    this.ws.onopen = function (event) {
      //cc.log("WebSocket 连接成功：", event);

      self._lastReceiveMsgTime = cc.sys.now();
      KQGlobalEvent.emit(Socket.Event.SocketConnectSuccessed, event);

      self.isCreating = false;
      self.socketError = false;
      self.createIndex = 0;
      self.connectionSuccess();
      self.sendReconnectInfo();
    };

    // socket 接收到消息
    this.ws.onmessage = function (event) {
      self._lastReceiveMsgTime = cc.sys.now();
      KQGlobalEvent.emit(Socket.Event.SocketReceiveMessage, event.data);

      self.isCreating = false;
      self.socketError = false;
      self.receviceMessage(event.data);
      self._dispatchResponse(event.data);
      self.recvTime = Date.now(); //接收最新一条信息的时间

      /**/
    };

    /**
     * socket 发生错误
     * 
     * socket 本身有 `onerror` 回调，但事实证明，其不靠谱，
     * 有很大的机率有误报的行为，常常在没有错误时，会给错误回调。
     * 且不能定制超时时长
     * 
     * @param {String} message 
     */
    this.ws._kq_onerror = function (message) {
      cc.error('WebSocket 连接错误：' + message);

      KQGlobalEvent.emit(Socket.Event.SocketConnectError, { data: message });
      self.ws.close();
      if (!self.ws) {
        return;
      }

      // 虽然调用了 websocket 的 close 方法，但是
      // 它并会立即调用 onclose 回调，而是在未来的某
      // 一时间再回调 onclose；但这里明显可以直接回调了。
      var ws = self.ws;

      self.ws.onclose();
      ws.onclose = function () {};
    };

    // socke 已关闭
    this.ws.onclose = function (event) {
      //cc.log('WebSocket 已关闭 close time=' + Date.now() + " event: " + event);

      self.isCreating = false;
      self.socketError = true;
      self.ws = null;
      self.connectionDisconnect();
      KQGlobalEvent.emit(Socket.Event.SocketDisconnect, event);
      //cc.log('socket close'+JSON.stringify(event));
    };
  },

  reconnect: function reconnect() {
    var self = this;
    this.scheduleOnce(function () {
      if (!self.isCreating && self.socketError) {
        self.createSocket();
      }
    }, 2);
  },

  sendReconnectInfo: function sendReconnectInfo() {
    var self = this;
    this.scheduleOnce(function () {
      if (this.userInfo != null) {
        var userId = self.userInfo.user_id || self.userInfo.id;
        self.sendMessage('reconnect', {
          'userId': userId
        });
      }
    }, 1);
  },

  receviceMessage: function receviceMessage(response) {},

  connectionDisconnect: function connectionDisconnect() {},

  connectionSuccess: function connectionSuccess() {},

  networkError: function networkError() {},

  checkNetworkStart: function checkNetworkStart() {},

  checkNetworkEnd: function checkNetworkEnd() {},

  _dispatchResponse: function _dispatchResponse(responseString) {
    //cc.log("WebSocket 接收到服务器消息：", responseString);
    var response = JSON.parse(responseString);
    var action = response["action"];
    if (action) {
      KQGlobalEvent.emit(action, response);
    }
  },

  // MARK: 前后台操作
  _registerAppActiveChange: function _registerAppActiveChange() {
    //cc.log("WebSocket 注册应用进入前、后台事件");
    cc.game.on(cc.game.EVENT_HIDE, this._appEnterBackground, this);
    cc.game.on(cc.game.EVENT_SHOW, this._appBecomActive, this);
  },

  /**
   * 进入后台
   */
  _appEnterBackground: function _appEnterBackground() {
    var now = cc.sys.now();
    if (now - this._lastAppEnterBackgroundTime < 100) {
      return;
    }
    this._lastAppEnterBackgroundTime = now;

    //cc.log("WebSocket 检测到应用进入后台：", new Date());
    var id = this.userInfo ? this.userInfo.id : undefined;
    Socket.sendAppPause(id);
    this._cancelCheckSocket();
  },

  /**
   * 进入前台 
   */
  _appBecomActive: function _appBecomActive() {
    var now = cc.sys.now();
    if (now - this._lastAppBecomActiveTime < 100) {
      return;
    }
    this._lastAppBecomActiveTime = now;

    //cc.log("WebSocket 检测到应用进入前台：", new Date());
    var id = this.userInfo ? this.userInfo.id : undefined;
    Socket.sendAppActive(id);
    this._checkSocket();

    this.scheduleOnce((function () {
      this._checkSocketExecute();
    }).bind(this), 1.5);
  },

  //进入后台操作
  enterbackgroudAction: function enterbackgroudAction() {
    this._appEnterBackground();
  },

  //进入前台操作
  resumeAction: function resumeAction() {
    //检查网络
    this._checkNetwork();
    this._appBecomActive();
  },

  sendMessage: function sendMessage(action, data) {
    data = this._strongVerifyData(data);

    if (this.socketError) {
      cc.error("socket 连接错误：" + this.socketError);
      this.reconnect();
      return;
    }
    //cc.log('WebSocket 发送消息：' + action, data);
    if (cc.sys.isObjectValid(this.ws)) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(this._convertParameterToString(action, data));
      }
    } else {
      this.connectionDisconnect();
    }
  },

  _strongVerifyData: function _strongVerifyData() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (typeof data == 'string') {
      data = { "string": data };
    }

    if (data == null) {
      data = {};
    }

    if (!data["userId"]) {
      if (this.userInfo && typeof this.userInfo == 'object' && this.userInfo.id) {
        data["userId"] = this.userInfo.id;
      }
    }
    return data;
  },

  _convertParameterToString: function _convertParameterToString(action) {
    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var obj = {};
    obj.action = action;
    obj.data = data;

    return JSON.stringify(obj);
  },

  // 检查网络
  _checkNetwork: function _checkNetwork() {
    if (this.checkNetworkNow) {
      this.checkNetworkNow();
    }

    this.shouldCheck = true;
    if (!this.socketError) {
      this.recvTime = 0;
      this.sendMessage('checkAction', '');
      this.scheduleOnce(function () {
        this.checkNetworkEnd();
        this.shouldCheck = false;
        if (this.recvTime === 0) {
          this.connectionDisconnect();
        }
      }, 2.5);
    } else {
      this.connectionDisconnect();
    }
  },

  // MARK: socket 掉线尽早确认
  _checkSocket: function _checkSocket() {
    this.schedule(this._checkSocketExecute, SocketConstant.MaxReconnectCheckInterval, cc.macro.REPEAT_FOREVER);
  },

  _cancelCheckSocket: function _cancelCheckSocket() {
    this.unschedule(this._checkSocketExecute);
  },

  _checkSocketExecute: function _checkSocketExecute() {
    if (this._isSocketTimeout() && this.ws) {
      this.ws._kq_onerror('连接超时');
      return;
    }
  },

  // socket 是否已超时
  _isSocketTimeout: function _isSocketTimeout() {
    return this._lastReceiveMessageInterval() >= this._timeout;
  },

  // 上一次收到消息到现在的时间间隔
  _lastReceiveMessageInterval: function _lastReceiveMessageInterval() {
    var now = cc.sys.now();
    var interval = (now - this._lastReceiveMsgTime) / 1000;
    //cc.log(`WebSocket 现在距上一条收到消息的时间间隔是：${interval} 秒`);
    return interval;
  }

});

// MARK: Socket 事件定义
Socket.Event = {
  SocketConnecting: "SocketConnecting", // Socket 正在连接
  SocketConnectSuccessed: "SocketConnectSuccessed", // 连接成功
  SocketDisconnect: "SocketDisconnect", // Socket 断开连接
  SocketConnectError: "SocketConnectError", // Socket 连接错误
  SocketReceiveMessage: "SocketReceiveMessage", // Socket 接收到消息

  LoginJoin: "loginJoin", // 客户端发送 从登陆界面获取房间号进入游戏
  RecordId: "recordId", // 客户端发送 
  OnceAgain: "onceAgain", // 客户端发送 
  BeiLv: "beiLv", // 客户端发送 
  InviteCode: "inviteCode", // 客户端发送   邀请码
  JoinDesk: "joinDesk", // 客户端发送
  CreateDesk: "createDesk", // 客户端发送
  LeaveDesk: "leaveDesk", // 离开桌子
  DissolveDesk: "dissolveDesk", // 解散桌子
  AnswerDissolve: "answerDissolve", // 回答请求退出命令
  GetDeskInfo: "getDeskInfo", // 客户端发送
  SendImage: "sendImage", // 客户端发送
  SendText: "sendText", // 客户端发送
  SendEmoji: "sendEmoji", // 客户端发送
  ChangeInfo: "changeInfo", // 客户端发送
  SendAudioMessage: "sendAudioMessage", // 客户端发送  发送语音消息
  GetRecord: "getRecord", // 获取战绩信息
  GetItemRecord: "getItemRecord", // 获取战绩信息
  PlayCard: "playCard", // 客户端发送，用户打出牌
  TimeoutDissolve: "timeoutDissolve", // 请求退出超时时，需要发出的消息
  Feedback: "feedback", // 客户端发送  反馈信息
  SharePng: "sharePng", // 客户端发送  分享领取砖石
  EnterRandom: "interRandom", // 客户端发送  进入随机场
  CancelRandom: "cancelRandom", // 客户端发送  取消进入随机场
  ForceExitRandom: "dissolve", // 客户端发送 强制退出随机场
  Ready: "ready", // 客户端发送 准备
  StartGame: "startGame", // 客户端发送 开始游戏
  GetHallInfo: "getHallInfo", // 客户端发送 获取大厅信息
  GetUserInfo: "getUserInfo", // 客户端发送 获取用户信息
  CheckAction: "checkAction", // 客户端发送，用来检测与服务器的连通性
  Pause: "pause", // 客户端进入后台时要发送的消息
  Active: "active", // 客户端回到前台时要发送的消息
  Qingli: "qingli", // 客户端回到前台时要发送的消息

  ReceiveRequestDissolve: "requestDissolve", // 请求解散桌子 服务器发送
  ReceiveRequestDissolveResult: "requestDissolveResult", // 请求解散桌子结果
  ReceiveChatText: "sendText", // 服务器发送
  ReceiveChatEmoji: "sendEmoji", // 服务器发送
  ReceiveDeskInfo: "deskInfo", // 服务器发送
  ReceiveGameOver: "gameOver", // 服务器发送
  ReceiveFaPai: "fapai", // 服务器发送
  ReceiveSharePng: "sharePngs", // 服务器发送
  ReceiveOnlineStatus: "sendOnlineStatus", // 服务器发送
  ReceiveOnChangeInfo: "changeInfo", // 服务器发送
  ReceiveAudioMessage: "sendAudioMessage", // 服务器发送，接收到用户发送了语音消息
  ReceivePlayCard: "playCard", // 服务器发送，有用户已经准备好牌
  ReceiveCreateDesk: "createDesk", // 服务器发送，创建房间的回调
  ReceiveReady: "ready", // 服务器发送，有用户点击了准备
  ReceiveHallInfo: "getHallInfo", // 服务器发送
  ReceiveGetUserInfo: "getUserInfo", // 服务器发送 获取用户信息
  ReceiveCheckAction: "checkAction", // 服务器发送  用来确认 Socket 还在连着
  ReceiveForceExit: "forceExit", // 服务器发送  用来使客户端强退
  ReceiveDissolveDesk: "dissolveDesk", // 服务器发送   当房主退出时，解散桌子
  ReceiveInterRandom: "interRandom", // 服务器发送   进入随机场的反馈
  ReceivePause: "pause", // 服务器发送   当有用户设备进入后台时，会收到这条消息
  ReceiveInviteCode: 'inviteCode', // 服务器发送，收到邀请码的消息
  ReceiveLeaveDesk: 'leaveDesk', // 服务器发送，收到需要离开桌子的消息
  ReceiveSelectBeiLv: 'selectBeiLv', // 服务器发送，收到选择倍率的消息
  ReceiveBeiLv: 'beiLv', // 服务器发送，收到倍率的消息
  ReceiveQingLi: 'qingli', // 服务器发送，收到请离
  ReceiveRecordId: 'recordId', // 服务器发送，收到战绩信息
  ReceiveLoginJoin: 'loginJoin', // 服务器发送，收到从页面进入房间信息
  ReceiveOnceAgain: 'onceAgain', // 服务器发送，收到再来一局信息
  ReceiveNoUionid: 'noUionid' };

// MARK: Socket 提供的可发给服务器消息的方法

// 服务器发送，收到没有unionID信号
Socket.sendCheckAction = function () {
  this.instance.sendMessage(this.Event.CheckAction, null);
};
/**/
Socket.sendDidReceiveGameOverAction = function (userId) {
  var param = userId ? { "userId": userId } : null;
  this.instance.sendMessage(Socket.Event.DidReceiveGameOverAction, param);
};
/**/

/**
 * 当 APP 进入后台时要发送的消息
 */
Socket.sendAppPause = function (userId) {
  var param = userId ? { "userId": userId } : null;
  this.instance.sendMessage(this.Event.Pause, param);
};

/**
 * 当 APP 进入前台时发送的消息
 */
Socket.sendAppActive = function (userId) {
  var param = userId ? { "userId": userId } : null;
  this.instance.sendMessage(this.Event.Active, param);
};

// 开房
Socket.sendCreateDesk = function (createDescInfo, userId) {
  cc.assert(createDescInfo);
  cc.assert(userId);

  createDescInfo["userId"] = userId;
  this.instance.sendMessage(this.Event.CreateDesk, createDescInfo);
};

Socket.sendQingli = function (leaveId, userId) {
  var param = {
    "leaveId": leaveId,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.Qingli, param);
};
// 从登陆页面加入房间
Socket.sendLoginJoin = function (roomId, userId) {
  var param = {
    "roomId": roomId,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.LoginJoin, param);
};
// 再来一局
Socket.sendOnceAgain = function (again, userId) {
  var param = {
    "userId": userId,
    "again": again
  };
  this.instance.sendMessage(this.Event.OnceAgain, param);
};
// 加入房间
Socket.sendJoinDesk = function (roomId, userId) {
  cc.assert(roomId);
  cc.assert(userId);

  var param = {
    "roomId": roomId,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.JoinDesk, param);
};
// 向服务端发送我选择的倍率
Socket.sendBeiLv = function (beilv, userId) {
  var param = {
    "beilv": beilv,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.BeiLv, param);
};
// 发送邀请码
Socket.sendInviteCode = function (inviteCode, userId) {
  var param = {
    "inviteCode": inviteCode,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.InviteCode, param);
};

// 获取房间信息
Socket.sendGetDesckInfo = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.GetDeskInfo, param);
};

Socket.sendText = function (userId, text) {
  //cc.assert(userId);
  //cc.assert(text);
  var param = {
    "msg": text,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SendText, param);
};
Socket.sendEmoji = function (userId, emoji) {
  var param = {
    "emoji": emoji,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SendEmoji, param);
};
Socket.sendChangeInfo = function (userId, Info) {
  var param = {
    "changeInfo": Info,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.ChangeInfo, param);
};
Socket.sendAudioMessage = function (userId) {
  var url = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

  cc.assert(userId);
  cc.assert(url.length > 0);

  if (url.length == 0) {
    return;
  }

  var param = {
    "url": url,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SendAudioMessage, param);
};

Socket.sendImage = function (userId, image) {
  cc.assert(userId);
  cc.assert(image);
  var param = {
    "msg": image,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SendImage, param);
};

Socket.sendGetRecrod = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };
  this.instance.sendMessage(this.Event.GetRecord, param);
};

Socket.sendGetRecrodFromId = function (recordId) {
  var param = {
    "recordId": recordId
  };
  this.instance.sendMessage(this.Event.RecordId, param);
};

Socket.sendDissolveDesk = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };
  this.instance.sendMessage(this.Event.DissolveDesk, param);
};

Socket.sendGetItemRecord = function (userId, parentId) {
  cc.assert(userId);
  cc.assert(parentId);
  var param = {
    "userId": userId,
    "parentId": parentId
  };

  this.instance.sendMessage(this.Event.GetItemRecord, param);
};

Socket.sendLeaveDesk = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.LeaveDesk, param);
},

/**
 * 回答退房请求
 * 
 * @param  {Number} userId 当前用户 id
 * @param  {NUmber} answer=1 回答。1 表示同意； 0 表示拒绝； -1 表示未选择
 */
Socket.sendAnswerDissolve = function (userId) {
  var answer = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  cc.assert(userId);
  var param = {
    "userId": userId,
    "answer": answer
  };

  this.instance.sendMessage(this.Event.AnswerDissolve, param);
}, Socket.sendForceExitRoom = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.DissolveDesk, param);
},

// 十三张中
// cardInfo 类似于：
// [{
//         'cards':[{'suit':suit,'number':number},{}],//特殊牌不用传
//         'type':0,
//         'value':4,
//         'isContainExtra':true,// 特殊牌是否包含特殊牌
//     },
//     {
//         'cards':[{'suit':suit,'number':number},{}],
//         'type':0,
//         'value':4
//     }]
Socket.sendPlayCard = function (userId, cardInfo) {
  cc.assert(userId);
  var param = {
    "userId": userId,
    "card": cardInfo
  };

  this.instance.sendMessage(this.Event.PlayCard, param);
};

Socket.sendTimeoutDissolve = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.TimeoutDissolve, param);
};

Socket.sendFeedback = function (userId, text) {
  cc.assert(userId);
  cc.assert(text);
  var param = {
    "userId": userId,
    "text": text
  };

  this.instance.sendMessage(this.Event.Feedback, param);
};

Socket.sendSharePng = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SharePng, param);
};
// 开始匹配随机场
Socket.sendEnterRandom = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.EnterRandom, param);
};

// 取消匹配随机场
Socket.sendCancelRandom = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.CancelRandom, param);
};

// 准备
Socket.sendReady = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.Ready, param);
}, Socket.sendStartGame = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };
  cc.log(this.Event.StartGame);
  cc.log();
  this.instance.sendMessage(this.Event.StartGame, param);
},

// 获取大厅信息
Socket.sendGetHallInfo = function (userId) {
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.GetHallInfo, param);
},

// 获取用户信息
Socket.sendGetUserInfo = function (userId, openId) {
  var param = {
    "userId": userId,
    "openId": openId
  };

  this.instance.sendMessage(this.Event.GetUserInfo, param);
}, module.exports = Socket;