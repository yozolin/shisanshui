const Socket = require('socket');
const Playback = require('Playback');
const record = require('record');

cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel:cc.Label,   // 时间
        jushuLabel:cc.Label,  // 局数
        createUser:cc.Node,   // 房主
        roomId:cc.Label,      // 房间号
        jifen:cc.Label,       // 积分
        id:cc.Label,
        avatarNode:cc.Node,   // 头像
        creatorImg:cc.Node,   // 创房头像
        nicknameLabels:cc.Label,
        scoreLabels:[cc.Label],
        //numNode:cc.Label,
        _parentId: null,
        //playbackNode:cc.Node,//回放按钮
        //watchNode:cc.Node,//查看按钮
        reordInfo:cc.Node,
        _recordItemInfo: null,
        totalGameResult:cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        this.totalGameResult = cc.find("Canvas/recordInfo");
    },

    setInfo: function (recordInfo) {
        this._parentId = recordInfo.id;
        //this.watchNode.active = true;
        //this.playbackNode.active = false;
        if (recordInfo.playersInfo.length == 0) {
            return;
        }

        let playersInfo = JSON.parse(recordInfo.playersInfo);
        recordInfo.scores = JSON.parse( recordInfo.scores );

        var fen = recordInfo.scores[ this.fen(recordInfo.userid,playersInfo.playersIndex) ] ;
        //cc.log(fen)
        //cc.log(recordInfo.scores)
        //cc.log(this.fen(recordInfo.userid,playersInfo.playersIndex))
        //cc.log(recordInfo.userid)
        //cc.log(playersInfo.playersIndex)
        //cc.log(recordInfo)
        //cc.log(playersInfo)
        //cc.log('----47')
        this.jifen.string = (fen >= 0?"+"+fen :fen);

        var headUrl = playersInfo.players[ this.creator(recordInfo.createUserId,playersInfo.playersIndex) ].avatarUrl; // 头像URL
        var sprite = this.avatarNode.getComponent(cc.Sprite);
        cc.loader.load({url:headUrl,type:"jpg"}, function (err, tex) {
            if (!err) {
                var frame = new cc.SpriteFrame(tex);
                sprite.spriteFrame=frame;
            }
        });

        this.roomId.string = "房号："+ playersInfo.roomId;
        this.timeLabel.string = "时间：" + playersInfo.time.substr(5,11);
        this.jushuLabel.string = "局数："+ this.js(playersInfo.setting1-2);

         //for (var i = 0;i < playersInfo.players.length;i++) {
         //  this.nicknameLabels[i].string = playersInfo.players[i].nickname;
         //  this.scoreLabels[i].string = playersInfo.players[i].totalScore;
         //}
    },
    js: function(setting2){
        var jushu = 5;
        switch(setting2){
            case 0: jushu = 5; break;
            case 1: jushu = 10; break;
            case 2: jushu = 20; break;
            case 3: jushu = 30; break;
        }
        return jushu;
    },

    fen:function(userid,players){         // 找积分
        for(var i =0; i<players.length;i++){
            if(players[i] == userid){
                return i;
            }
        }
    },
    creator :function(creator,players){    //创房者
        for(var i =0; i<players.length;i++){
            if(players[i] == creator){
                return i;
            }
        }
    },

    clickAction: function( event, data ) {
        let playersInfo = JSON.parse(data.playersInfo);
        let totalGameResultComp = this.totalGameResult.getComponent('TotalGameResult');
        totalGameResultComp.setPlayerInfos(playersInfo.players, data);
        totalGameResultComp._clickBtn();
        this.totalGameResult.getComponent('alert').alert();

        //if (this._recordItemInfo) {
        //  this._startPlayback(this._recordItemInfo._info8Array);
        //  return;
        //}
        ////Socket.sendGetItemRecord(Socket.instance.userInfo.id,this._parentId);
        //Socket.sendGetItemRecord(Socket.instance.userInfo.id,--index);
    },

    _startPlayback: function (playBackInfo) {
        //Playback.instance.setPlaybackDatas(playBackInfo);
        //cc.director.loadScene('play');
    },

    detailAction: function(recordItemInfo, index) {
        //this._recordItemInfo = recordItemInfo;
        ////this.playbackNode.active = true
        ////console.log();
        ////this.numNode.string = "第" + (index + 1) + "局";
        //this.timeLabel.string = recordItemInfo.creatAt.substr(5,11);
        //let objArray = JSON.parse(recordItemInfo.info8);
        //this._recordItemInfo._info8Array = objArray;
        //let playersArray = objArray.map(function(str){
        //  return JSON.parse(str);
        //});
        //
        //var players = playersArray[playersArray.length-1].data.players;
        //for (var i = 0;i < players.length;i++) {
        //    this.nicknameLabels[i].string = players[i].nickname;
        //    this.scoreLabels[i].string = players[i].cScore;
        //}
    },
    records:function(){

    },


});