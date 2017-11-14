"use strict";
cc._RFpush(module, '452f4rFUqRLFYlGEJS5kEWs', 'record');
// scripts\record.js

var KQGlobalEvent = require('KQGlobalEvent');
var Socket = require('socket');
cc.Class({
    'extends': cc.Component,

    properties: {
        scrollView: cc.Node,
        recordItem: cc.Prefab
    },

    //subScrollView:cc.Node,
    //subRecordItem:cc.Node,
    //splash:cc.Prefab,
    //reordInfo:cc.Node,
    //
    //jifen:cc.Label,
    //head:cc.Node,
    //id:cc.Label,
    //nickname:cc.Label,
    //creat:cc.Label,        // 创房人
    //createUser:cc.Node,     //  头像
    //
    //timeLabel:cc.Label,   // 时间
    //jushuLabel:cc.Label,  // 局数
    ////createUser:cc.Node,   // 房主
    //roomId:cc.Label,      // 房间号
    //_records:null,
    // use this for initialization
    onLoad: function onLoad() {
        //this.isSubPage = false;
        //this.subScrollView.active = false;
        //
        //this.subScrollViewContent = this.subScrollView.getComponent(cc.ScrollView).content;
        //console.log( this.subScrollViewContent );
        //this.recordInfo = this.subScrollViewContent.children[0];
        //this.reords = this.subScrollViewContent.children[0].children[3];
        this.scrollViewContent = this.scrollView.getComponent(cc.ScrollView).content;
        this._registerSocketEvent();
    },

    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.GetRecord, this._ReceiveRecordInfo, this);
        //KQGlobalEvent.on(Socket.Event.GetItemRecord, this._ReceiveRecordItem, this);
    },

    _ReceiveRecordInfo: function _ReceiveRecordInfo(response) {
        //cc.log(response)
        //cc.log('------78')
        //console.log(response);
        //this._records = response.data;
        //this.isSubPage = false;
        //this.subScrollView.active = false;
        //this.scrollView.active = true;

        this.scrollViewContent.removeAllChildren();
        var index = 0;
        response.data.filter(function (record) {
            return record.playersInfo.length > 0;
        }).forEach((function (recordInfo) {
            index++;
            var item = cc.instantiate(this.recordItem);
            this.scrollViewContent.addChild(item);
            var comp = item.getComponent('recordInfo');
            comp.setInfo(recordInfo);
            var recordBtn = item.children[7].getComponent(cc.Button);
            recordBtn.clickEvents[0].customEventData = recordInfo;
            // var eventHandler = new cc.Component.EventHandler();
            // eventHandler.target = comp.node.children[7];
            // eventHandler.component = "btn";
            // eventHandler.handler = "clickAction";
            //eventHandler.customEventData = "my data";
            //console.log(comp.node.children[7]);
        }).bind(this));
    },

    closeAction: function closeAction() {
        if (this.isSubPage) {
            this.isSubPage = false;
            this.subScrollView.active = false;
            this.scrollView.active = true;
        } else {
            this.node.getComponent('alert').dismissAction();
        }
    }
});
/* clickAction:function( index ){
     //_ReceiveRecordItem()
 },
 _ReceiveRecordItem:function(RecordItemInfo) {
     cc.log(RecordItemInfo)
     cc.log('------78')
     //console.log(RecordItemInfo);return;
     var index = RecordItemInfo.data
     var playersInfo = JSON.parse(this._records[index].playersInfo);
     
     var players = playersInfo.players;                  // 玩家信息
     var playersIndex = playersInfo.playersIndex;        // 玩家的位置
     var createUserId = this._records[index].createUserId;   // 创房ID
     var sendUserId = this._records[index].userid;           // 发送人ID
      this.isSubPage = true;
     this.subScrollView.active = true;
     this.scrollView.active = false;
      this.timeLabel.string = (this._records[index].createAt).substr(5,11);               // 时间
     this.jushuLabel.string = this.js(JSON.parse(this._records[index].setting2));        // 局数
     this.roomId.string = this._records[index].roomId;                                   // 房间号
     this.creat.string = this.findCreator(this._records[index].createUserId,players);    // 房主
      this.subScrollViewContent = this.subScrollView.getComponent(cc.ScrollView).content;
     this.subScrollViewContent.removeAllChildren();
      for(var i = 0; i < players.length; i++ ){
         var item = cc.instantiate(this.splash);
         this.subScrollViewContent.addChild(item);
         var comp = item.getComponent('recordInfo');
         var creator = 0;       
         var self = 0;       // 表示自己，要对自己的比牌记录背景做处理
         if(createUserId == players[i].id){
             creator =1;
         }
         if( sendUserId == players[i].id){
             self = 1;
         }
         this.records(comp,i,creator,self,index);
     }
  },
 records:function(info,i,creator,self,index){
     if(self){
         info.node.color = new cc.Color(125, 126, 200);
     }
     cc.log(info)
     cc.log('----119')
     var players = JSON.parse(this._records[index].playersInfo).players;
     var scores = this._records[index].scores ;
     info.nicknameLabels.string = players[i].nickname;
     info.id.string = players[i].id;
     info.jifen.string = scores[i];
      var headUrl = players[i].avatarUrl;   //头像连接
     var sprite = info.avatarNode.getComponent(cc.Sprite);
     cc.loader.load(headUrl+".jpg", function (err, tex) {
       if (!err) {
           var frame = new cc.SpriteFrame(tex);
           sprite.spriteFrame=frame;
       }
     });
     info.creatorImg.active = creator;
 },
 findCreator:function(createId,players){ //找房主
     for(var i=0; i<players.length;i++){
         if(createId == players[i].id){
             return players[i].nickname;
         }
     }
 },
 js:function(num){
     var J = 5;
     switch(num){
         case 0: J = 5;break;
         case 1: J = 10;break;
         case 2: J = 20;break;
         case 3: J = 30;break;
     }
     return J;
 },*/

cc._RFpop();