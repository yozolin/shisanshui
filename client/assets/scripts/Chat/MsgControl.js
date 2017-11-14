const Socket = require('socket');
const ChatMessage = require('ChatMessage');
const AudioManager = require('AudioManager');

// 用来发送消息的 component
cc.Class({
    extends: cc.Component,

    properties: {
        //bqNode:cc.Node,
        //bqNode1:cc.Node,
        //btnLanguageNode:cc.Node,
        //btnLanguageNode1:cc.Node,
        //btnChartNode:cc.Node,
        //btnChartNode1:cc.Node,
        textScrollView:cc.Node,
        imageContentNode:cc.Node,

        editBox: cc.EditBox,

        textRecordScrollView: cc.ScrollView,
        textRecordLayout: cc.Layout,

        textPrefab:cc.Prefab,
        chatTextRecordPrefab: cc.Prefab,
        emojiPrefab:cc.Prefab,
        // imagePrefab:cc.Prefab,

        biaoqing: [cc.Node],    // [亮的背景, 暗的背景]   快捷语
        kuaijieyu: [cc.Node],   // [亮的背景, 暗的背景]   表情
        content:[cc.Node],      // [快捷语, 表情]   
        inputNode:cc.Node,
        emoji:[cc.Node],
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


    clickKuaiJieYu :function(){
        this.kuaijieyu[0].active = true;    // 快捷语 背景
        this.kuaijieyu[1].active = false;   // 快捷语 按钮
        this.biaoqing[0].active = false;    // 背景表情
        this.biaoqing[1].active = true;     // 表情按钮
        this.content[0].active = true;
        this.content[1].active = false;
    },
    clickBiaoQing :function(){
        this.biaoqing[0].active = true;     // 背景表情
        this.biaoqing[1].active = false;    // 表情按钮
        this.kuaijieyu[0].active = false;   // 快捷语 背景
        this.kuaijieyu[1].active = true ;   // 快捷语 按钮
        this.content[0].active = false;
        this.content[1].active = true;
    },
    onTextClickAction:function(text = "") {
        this.editBox.string = "";
        this.sendText(text);
    },

    clickEmoji: function (event, emojiName) {
        let string = this.editBox.string;
        this.editBox.string = string + "<" + emojiName + ">";
        this.sendEmoji(emojiName);
    },

    clickSend: function () {
        let string = this.editBox.string || "";
        if (string.length == 0) {
            return;
        }
        this.editBox.string = "";
        this.sendText(string);
    },

    sendEmoji :function(emojiName){
        if(emojiName.length ==0){
            return
        }
        Socket.sendEmoji(this._userId, emojiName);
        this.dismiss();
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

    addChatEmojiMessage:function(userId,emoji){
        this._playerInfos = this._playerInfos || [];

        var nickname = "[ID:" + userId + "说]：";
        let userInfo = this._playerInfos.find(function (userInfo) {
            return userInfo.id == userId;
        });
        if (userInfo) {
            nickname = "[" + userInfo.nickname + "说]：";
        };
        var str = nickname + emoji;
        str = ChatMessage.parseString(str);
        this._addChatEmojiToRecord(emoji);
        // cc.log(emoji)
        // cc.log('---190')
    },

    _addChatEmojiToRecord:function(emoji){
        var self = this;
        this._loadEmojiFrame(emoji,function(frame){
            //var item  = cc.instantiate(self.emojiPrefab);
            //cc.log(frame)
            //var btnSprites =  item.getComponent(cc.Sprite);
            //btnSprites.spriteFrame = frame;
            //let chatEmojiRecord = item.getComponent('ChatTextRecord');
            //chatEmojiRecord.setEmoji(frame);
            ChatMessage.setEmoji(frame);

        })
    },

    _loadEmojiFrame :function(Emojiname ,callback){
        cc.loader.loadRes("/textures/chat/bq", cc.SpriteAtlas, function (err, atlas) {
            if(err){
                //console.log(null, err)
                return;
            }
            var frame = atlas.getSpriteFrame(Emojiname);
            callback(frame);
        }.bind(this))

    },

    _addChatTextToRecord: function (text) {
        var item = cc.instantiate(this.chatTextRecordPrefab);
        let chatTextRecord = item.getComponent('ChatTextRecord');
        chatTextRecord.setString(text);

        this.textRecordLayout.node.addChild(item);
        this.textRecordScrollView.scrollToBottom();
    },
});
