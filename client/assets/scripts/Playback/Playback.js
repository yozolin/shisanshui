const Socket = require('socket');

// 用于回放的组件
const Playback = cc.Class({
    extends: cc.Component,

    properties: {
      _playbackDatas: null,   // 用于回放的数据
      _isPlaybacking: false,
    },

    statics: {
      instance: null,
    },

    onLoad: function () {
      Playback.instance = this;
      cc.game.addPersistRootNode(this.node);
    },

    // 设置回放数据
    setPlaybackDatas: function (datas) {
      this._playbackDatas = datas;
    },

    // 清空回放数据。同时会清空回放
    removePlaybackDatas: function () {
      this.setPlaybackDatas(null);
      this.stopPlayback();
    },

    // 是否包含回放数据
    isContainPlaybackDatas: function () {
      return this._playbackDatas != null;
    },

    // 开始回放
    startPlayback: function () {
      // 模拟 socket 接收到了事件即可
      //cc.log("Playback 开始回放");

      this._isPlaybacking = true;

      if (!this._playbackDatas) {
        cc.error("想回放，却没有回放数据");
        this.stopPlayback();
        return;
      }

      this._executePlayback();
    },

    // 停止回放
    stopPlayback: function () {
      this._isPlaybacking = false;
      this.unscheduleAllCallbacks();
    },

    // 是否正在回放
    isPlaybacking: function () {
      return this._isPlaybacking;
    },

    // 执行真正的回放操作
    _executePlayback: function () {
      let startTime = 1.0;
      let interval = 3.0;
      cc.log(this._playbackDatas);

      // 在某些特殊情况下
      // 回放数据里会包含两套 gameOver action
      // 所以需要过滤掉其中一个
      this._playbackDatas = this._playbackDatas.filter(function(string, index) {
        if (index == this._playbackDatas.length - 1) {
          return true;
        }

        return (string.indexOf('"action":"gameOver') == -1);
      }.bind(this));

      this._playbackDatas.forEach(function (data, index) {
        var delay = startTime + index * interval;
        if (index == this._playbackDatas.length - 1) {
          // 如果是最后一个，则应该只间隔一秒
          delay = startTime + (index - 1) * interval + 1;
        }

        this.scheduleOnce(function () {
          cc.log("回放开始模拟 Socket 接收到服务器消息, ", index);
          Socket.instance._dispatchResponse(data);
        }, delay);

      }.bind(this));

    },

});

module.exports = Playback;
