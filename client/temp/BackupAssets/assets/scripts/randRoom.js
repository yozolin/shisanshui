const Socket = require('socket');
const KQGlobalEvent = require('KQGlobalEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        matchingLabel:cc.Label,
        timeNode:cc.Node,
        matchingNode:cc.Node,
        waitingPrefab: cc.Prefab,
        alertPrefab: cc.Prefab,

        _userId: null,
    },

    // use this for initialization
    onLoad: function () {
      this._userId = Socket.instance.userInfo.id;
      cc.isRoomViewShow = true;
      KQGlobalEvent.on(Socket.Event.ReceiveDeskInfo, this._socketReceiveDeskInfo ,this);
      KQGlobalEvent.on(Socket.Event.SocketDisconnect, this._socketDisconnect, this);
      KQGlobalEvent.on(Socket.Event.SocketConnectSuccessed, this._socketConnected, this);
      KQGlobalEvent.on(Socket.Event.ReceiveInterRandom, this._socketReceiveInterRandom, this);
    },

    _socketReceiveDeskInfo: function (response) {
      if (!response.result) {
        return;
      }

      cc.director.loadScene('play');
    },

    _socketReceiveInterRandom: function(response) {
        this.unschedule(this._timeoutRandomAction);

        // 处理随机场匹配不成功的情况
        if (response.result) {
            return;
        }

        let reason = response.data.reason || "加入随机场失败";
        this.showAlertMessage(reason);

        if (reason == '你已经在匹配队列') {
            this._showMatching();
        } else {
            this._hideMatching();
        }
    },

    _socketDisconnect: function() {
      // 连接已断开
      this.matchingNode.active = false;
      this.showNetworkMessage('网络链接断开，重新连接中...');
    },

    _socketConnected: function() {
      this.hiddenNetworkMessage();
    },


    onDestroy: function () {
      KQGlobalEvent.offTarget(this);
    },

    clickExit: function () {
        cc.director.loadScene('hall');
    },

    clickStart: function () {
      Socket.sendEnterRandom(this._userId);
      this._showMatching();

      this.scheduleOnce(this._timeoutRandomAction, 5);
    },
    /*取消匹配*/
    clickCancel:function () {
      Socket.sendCancelRandom(this._userId);

      this._hideMatching();
    },

    _timeoutRandomAction: function() {
        this._hideMatching();
        this.showAlertMessage('进入匹配失败');
    },

    _showMatching: function() {
        var comp = this.matchingNode.getComponent('alert');
        comp.alert();
        this.matchingLabel.string = '正在匹配中，请稍后...';
        let num = 0;
        this.schedule(function() {
            num = num + 0.5;
            this.timeNode.rotation = num;
         }, 0.01);
    },

    _hideMatching: function() {
        var comp = this.matchingNode.getComponent('alert');
        comp.dismissAction();
    },

     showNetworkMessage:function(msg) {
        this.unschedule(this._timeoutRandomAction);

        if (this.networkNode != null) {
            var removeSelfAction = cc.removeSelf();
            this.networkNode.runAction(removeSelfAction);
            this.networkNode = null;
        }
        this.networkNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.networkNode);
        var comp = this.networkNode.getComponent('alert');
        var self = this;
        comp.onDismissComplete = function() {
            self.networkNode = null;
        };
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenNetworkMessage:function() {
        if (this.networkNode != null) {
            this.networkNode.getComponent('alert').dismissAction();
        }
    },

    showAlertMessage: function(msg) {
        if (!msg) {
            cc.error("不能显示为空的信息");
            return;
        }

        if (!this.alertMessageNode) {
            this.alertMessageNode = cc.instantiate(this.alertPrefab);
            this.node.addChild(this.alertMessageNode);
        }

        this.alertMessageNode.getComponent('alert').setMessage(msg);
        this.alertMessageNode.getComponent('alert').alert();
    },
});
