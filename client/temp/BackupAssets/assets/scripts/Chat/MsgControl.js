const Socket = require('socket');
const ChatMessage = require('ChatMessage');
const AudioManager = require('AudioManager');

// 用来发送消息的 component
cc.Class({
    extends: cc.Component,

    properties: {
        bqNode:cc.Node,
        bqNode1:cc.Node,
        btnLanguageNode:cc.Node,
        btnLanguageNode1:cc.Node,
        btnChartNode:cc.Node,
        btnChartNode1:cc.Node,
        textScrollView:cc.Node,
        imageContentNode:cc.Node,

        editBox: cc.EditBox,

        textRecordScrollView: cc.ScrollView,
        textRecordLayout: cc.Layout,

        textPrefab:cc.Prefab,
        chatTextRecordPrefab: cc.Prefab,
        // imagePrefab:cc.Prefab,

        inputNode:cc.Node,

        _userId: null,

        _playerInfos: null,        // 记录用户信息
        _chatTextMessageRecords: null, // 聊天文本消息记录
    },

    // use this for initialization
    onLoad: function () {
        this._userId = Socket.instance.userInfo.id;
        this._playerInfos = [];
        this.textContent = this.textScrollView.getComponent(cc.ScrollView).content;
        // this.imageContent = this.imageScrollView.getComponent(cc.ScrollView).content;

        var self = this;

        var textData = AudioManager.instance.chatTexts();
        for (var i = 0; i < textData.length; i++) {
            var item = cc.instantiate(this.textPrefab);
            item.getComponent('cellText').setText(textData[i]);
            item.getComponent('cellText').onSelectAction = function(text) {
                self.onTextClickAction(text);
            };
            this.textContent.h = 1000;
            this.textContent.addChild(item);
        }
    },

    onTextClickAction:function(text = "") {
      this.editBox.string = "";
      this.sendText(text);
    },

    clickEmoji: function (event, emojiName) {
      let string = this.editBox.string;
      this.editBox.string = string + "<" + emojiName + ">";
    },

    clickSend: function () {
      let string = this.editBox.string || "";
      if (string.length == 0) {
        return;
      }

      this.editBox.string = "";
      this.sendText(string);
    },

    sendText: function (text = "") {
      if (text.length == 0) {
        return;
      }

      Socket.sendText(this._userId, text);
      this.dismiss();
    },

    dismiss: function () {
      this.node.active = false;
    },

    bqAction:function() {
        this.bqNode1.active = this.btnLanguageNode.active = this.btnChartNode1.active = true;
        this.bqNode.active = this.btnLanguageNode1.active = this.btnChartNode.active = false;
        this.textScrollView.active = false;
        this.imageContentNode.active = true;
        this.textRecordScrollView.node.active = false;
    },

    textAction:function() {
        this.bqNode1.active = this.btnLanguageNode.active = this.btnChartNode.active = false;
        this.bqNode.active = this.btnLanguageNode1.active = this.btnChartNode1.active = true;
        this.textScrollView.active = true;
        this.imageContentNode.active = false;
        this.textRecordScrollView.node.active = false;
    },

    chartAction:function() {
        this.bqNode1.active = this.btnLanguageNode1.active = this.btnChartNode1.active = false;
        this.bqNode.active = this.btnLanguageNode.active = this.btnChartNode.active = true;
        this.textScrollView.active = this.imageContentNode.active = false;
        this.textRecordScrollView.node.active = true;
    },

    addPlayerInfos: function (playerInfos) {
      this._playerInfos = this._playerInfos || [];

      playerInfos.forEach(function (userInfo) {
        let haveUserInfo = this._playerInfos.find(function (ownUserInfo) {
          return ownUserInfo.id == userInfo.id;
        });

        if (haveUserInfo == null) {
          this._playerInfos.push(userInfo);
        }
      }.bind(this));
    },

    addChatTextMessage: function (userId, text) {
      this._playerInfos = this._playerInfos || [];

      var nickname = "[ID:" + userId + "说]：";
      let userInfo = this._playerInfos.find(function (userInfo) {
        return userInfo.id == userId;
      });

      if (userInfo) {
        nickname = "[" + userInfo.nickname + "说]：";
      }

      var str = nickname + text;
      str = ChatMessage.parseString(str);
      this._addChatTextToRecord(str);
    },

    _addChatTextToRecord: function (text) {
      var item = cc.instantiate(this.chatTextRecordPrefab);
      let chatTextRecord = item.getComponent('ChatTextRecord');
      chatTextRecord.setString(text);

      this.textRecordLayout.node.addChild(item);
      this.textRecordScrollView.scrollToBottom();
    },
});
