const KQNativeInvoke = require('KQNativeInvoke');
const Socket = require('socket');
cc.Class({
    extends: cc.Component,

    properties: {
        itemLayout: cc.Layout,
        itemPrefab: cc.Prefab,
        timeLabel:cc.Label,   // 时间
        jushuLabel:cc.Label,  // 局数
        roomId:cc.Label,      // 房间号
        nicknameLabels:cc.Label,
        recordInfo_sview:[cc.Node],

        sharrBg:cc.Node,
        btnWeiXin:cc.Node,
        btnGongXuoHao:cc.Node,
        btnZhuShou:cc.Node,
        btnZongFen:cc.Node,

        suanfen_sview:cc.Node,
        suanFenPrefab: cc.Prefab,
        suanFenBgPrefab: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {

    },

    onDisable:function(){
        //if(cc.sys.isBrowser){
        //
            var shareTitle = '开房玩[大众十三水]';
            var desc = '开好房了，就等你们一起来[大众十三水]啦！晚了位置就没了哟~'; 
            cc.sys.localStorage.setItem('shareTitle',shareTitle);
            cc.sys.localStorage.setItem('desc',desc);
            
            // cc.sys.localStorage.removeItem("shareTitle");
            // cc.sys.localStorage.removeItem("desc");
            cc.sys.localStorage.removeItem("recordId");
            //cc.sys.localStorage.setItem("roomId",'');
            if(window.shareToTimeLine) {
                window.shareToTimeLine();
            }
            if(window.shareToSession) {
                window.shareToSession();
            }
        //}

    },
    js: function(setting2){
        var jushu = 5;
        switch(setting2){
            case 0: jushu = 5; break;case 1: jushu = 10; break;
            case 2: jushu = 20; break;case 3: jushu = 30; break;
        }
        return jushu;
    },

    creator :function(creator,players){    //创房者
        for(var i =0; i<players.length;i++){
            if(players[i].id == creator){
                return i;
            }
        }
    },

    _clickBtn :function(){
        this.btnZhuShou.active = true;
        this.btnZongFen.active = false;
    },

    clickZongFen :function(){

        this.btnZhuShou.active = true;

        this.btnZongFen.active = false;

        this.recordInfo_sview.forEach(function (node) {node.active = true;});

        this.suanfen_sview.active = false;
    },
    _globalMsg:function(recordInfo){
        //if(cc.sys.isBrowser) {
            var roomId ="房间号："+recordInfo.roomId;
            var pj = ["5 ","10 ","20 "];  
            var js = "局数："+pj[recordInfo.setting1-2];
            var time = "时间："+(recordInfo.createAt?recordInfo.createAt:recordInfo.createTime);
            var shareTitle = "[大众十三水]战绩";
            var desc = roomId+js+time+" 点击查看详情";
            var recordId = (recordInfo.id!=undefined)?recordInfo.id:recordInfo.recordId;  
            cc.sys.localStorage.setItem("shareTitle",shareTitle);
            cc.sys.localStorage.setItem("desc",desc);
            cc.sys.localStorage.setItem("recordId",recordId);
            cc.sys.localStorage.setItem("roomId",'');

            if(window.shareToTimeLine) {
                window.shareToTimeLine();
            }
            if(window.shareToSession) {
                window.shareToSession();
            }
        //}
    },
    //大局
    setPlayerInfos: function (playerInfos, deskInfo){
        playerInfos.sort(function(a,b){return b.totalScore-a.totalScore}); // 排序
        // cc.log(playerInfos)
        // cc.log(deskInfo)
        // cc.log('--65')
         
        this._globalMsg(deskInfo);
        this.recordInfo_sview.forEach(function (node) {node.active = true;});

        this.suanfen_sview.active = false;

        this.btnZhuShou.active = true;

        this.btnZongFen.active = false;

        this._playerInfos = playerInfos;

        this._deskInfo = deskInfo;

        var createId = deskInfo.createUserId? deskInfo.createUserId: deskInfo.createId;

        var nickname = playerInfos[ this.creator(createId, playerInfos) ].nickname;

        this.roomId.string = deskInfo.roomId;

        var createAt = deskInfo.createAt? deskInfo.createAt: deskInfo.createTime;

        this.timeLabel.string = createAt.substr(0,11);

        this.jushuLabel.string = this.js(deskInfo.setting1-2);

        this.nicknameLabels.string = nickname;

        this.itemLayout.node.removeAllChildren();

        playerInfos.forEach(function (user) {

            let item = cc.instantiate(this.itemPrefab);

            item.getComponent('TotalGameResultItem').setUserInfo(user, deskInfo);

            if(deskInfo.createUserId == user.id || deskInfo.createId == user.id){

                item.children[1].children[0].active = true;

            }else{

                item.children[1].children[0].active = false;

            }

            this.itemLayout.node.addChild(item);

        }.bind(this));

    },

    //算分能手
    clickSuanFen: function () {

        this.btnZhuShou.active = false;

        this.btnZongFen.active = true;

        this.recordInfo_sview.forEach(function (node) {node.active = false;});

        this.suanfen_sview.active = true;

        var playersRigth = this._playerInfos.filter(function (player) {return player.totalScore > 0;});

        var playersLeft = this._playerInfos.filter(function (player) {return player.totalScore < 0;});

        var playersRigthScore = playersRigth.map(function (player) {return player.totalScore;});

        var playersLeftScore = playersLeft.map(function (player) {return player.totalScore * -1;});

        var playersIndex = [],

            arrs = [playersRigthScore.filter(function(i){return i;}),playersLeftScore.filter(function(i){return i;})],

            indexs = playersLeftScore.length > playersRigthScore.length? 0: 1;//1是赢的人 0输的人

        // for(var i = 0;i < arrs[indexs].length; i++){

        //     var score = arrs[indexs][i];

        //     var d = this.getCombBySum(arrs[indexs==1?0:1], score)[0] || [];

        //     if(d.length > 0){

        //         playersIndex.push([score,d]);

        //         d.forEach(function (s) {

        //             var index = arrs[indexs==1?0:1].indexOf(s);

        //             if(index != -1) arrs[indexs==1?0:1].splice(index,1);

        //         });
        //     }
        // }

        // if(playersIndex.length == 0) indexs = 2;
        indexs = 2
        this.suanfen_sview.children[0].removeAllChildren();

        playersLeft.forEach(function (user, index) {

            var suanFenBgPrefab = cc.instantiate(this.suanFenBgPrefab);

            suanFenBgPrefab.removeAllChildren();

            this._ctarePrefab(1 ,suanFenBgPrefab, user, user.totalScore, this._deskInfo ,-200 ,0);

            var x = 0, y = 0;

            if(indexs == 1){
                for(var j = 0; j < playersIndex[index][1].length; j++){

                    var s = playersIndex[index][1][j];

                    var d = playersRigthScore.indexOf(s);

                    if(d != -1){

                        var plays = playersRigth.splice(d,1)[0];

                        playersRigthScore.splice(d,1);

                        if(plays){

                            if(suanFenBgPrefab.childrenCount >= 3) y = -90;

                            if(suanFenBgPrefab.childrenCount == 3) x = 0;

                            if(suanFenBgPrefab.childrenCount >= 5) y = -180;

                            if(suanFenBgPrefab.childrenCount == 5) x = 0;

                            this._ctarePrefab(0, suanFenBgPrefab, plays, plays.totalScore, this._deskInfo, x ,y);

                            x += 200;

                        }
                    }
                }
            }
            else if(indexs == 0){
                var fen = suanFenBgPrefab.children[0].getChildByName("fen").getComponent(cc.Label).string.substr(3) * -1;

                for(var j = 0; j < playersIndex.length; j++){

                    var s = playersIndex[j];

                    var d = s[1].indexOf(fen);

                    var q = s[0];

                    var w = playersRigthScore.indexOf(q);

                    if(d != -1 && w != -1){

                        var plays = playersRigth[w];

                        this._ctarePrefab(0, suanFenBgPrefab, plays, plays.totalScore, this._deskInfo, x, y, fen);
                    }
                }
            }
            else {
                var q = playersLeftScore[index];
                var addScore = 0;
                var arr = [];
                for(var j = 0; j < playersRigthScore.length; j++){
                    var w = playersRigthScore[j];
                    if(addScore < q){
                        addScore += w;
                        if(addScore > q){
                            arr.push(w - (addScore - q));
                        }else{
                            arr.push(w);
                        }
                        if(q - w >= 0){
                            playersRigthScore[j] = 0;
                        }
                    }
                    if(addScore > q){
                        playersRigthScore[j] = addScore - q;
                        break;
                    }
                }

                for(var t = 0; t < arr.length; t++){
                    var r = arr[t];
                    if(r == 0) continue;
                    if(suanFenBgPrefab.childrenCount >= 3) y = -90;

                    if(suanFenBgPrefab.childrenCount == 3) x = 0;

                    if(suanFenBgPrefab.childrenCount >= 5) y = -180;

                    if(suanFenBgPrefab.childrenCount == 5) x = 0;

                    var plays = playersRigth[t];

                    this._ctarePrefab(0, suanFenBgPrefab, plays, r, this._deskInfo, x, y);

                    x += 200;
                }

            }

            this.suanfen_sview.children[0].addChild(suanFenBgPrefab);

        }.bind(this));

    },

    _ctarePrefab: function (shu, node, user, totalScore, deskInfo, x, y, fen = null) {

        var suanFenPrefab = cc.instantiate(this.suanFenPrefab);

        suanFenPrefab.getChildByName("ID").getComponent(cc.Label).string = "ID:"+user.id;

        if(deskInfo.createUserId == user.id)suanFenPrefab.getChildByName("ID").color = new cc.Color(235, 115, 122);

        suanFenPrefab.getChildByName("shu").getComponent(cc.Label).string = shu == 0? "输": "";

        var str = shu == 0? totalScore+"分": "总分:"+totalScore;

        if(fen) str = fen+"分";

        suanFenPrefab.getChildByName("fen").getComponent(cc.Label).string = str;

        var sprite = suanFenPrefab.getChildByName("haed").getComponent(cc.Sprite);

        var headUrl = user.avatarUrl; // 头像URL

        cc.loader.load({url:headUrl,type:"jpg"}, function (err, tex) {

            if (!err) {

                var frame = new cc.SpriteFrame(tex);

                sprite.spriteFrame = frame;

                sprite.node.height = 55;

                sprite.node.width = 55;

            }

        });

        suanFenPrefab.x = x;

        suanFenPrefab.y = y;

        node.height = 90 + y * -1;

        node.addChild(suanFenPrefab);

    },

    clickExit: function () {
        Socket.sendOnceAgain('false',this._userId);
        cc.director.loadScene('hall');
    },

    clickShareWeiChat: function () {
        if(!cc.sys.isNative){
            this.sharrBg.active = true;
        }else{
            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName,"wxScreenShareFriend",);
            }
             else {//Android
                  KQNativeInvoke.screenshotShare();
            }
       }
    },
    clickShareBg :function () {
        this.sharrBg.active = false;
    },
    clickSharePengYouQuan: function () {
      if (KQNativeInvoke.isNativeIOS()) {
          jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName,"wxScreenShare",);
      }
      else {//Android
          jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxScreenShare", "()V");
      }
    },

    getCombBySum: function (array,sum,tolerance,targetCount) {
        var util = {
                /*
                 get combination from array
                 arr: target array
                 num: combination item length
                 return: one array that contain combination arrays
                 */
                getCombination: function(arr, num) {
                    var r=[];
                    (function f(t,a,n)
                    {
                        if (n==0)
                        {
                            return r.push(t);
                        }
                        for (var i=0,l=a.length; i<=l-n; i++)
                        {
                            f(t.concat(a[i]), a.slice(i+1), n-1);
                        }
                    })([],arr,num);
                    return r;
                },
                //take array index to a array
                getArrayIndex: function(array) {
                    var i = 0,
                        r = [];
                    for(i = 0;i<array.length;i++){
                        r.push(i);
                    }

                    return r;
                }
            },logic = {
                //sort the array,then get what's we need
                init: function(array,sum) {
                    //clone array
                    var _array = array.concat(),
                        r = [],
                        i = 0;
                    //sort by asc
                    _array.sort(function(a,b){
                        return a - b;
                    });
                    //get all number when it's less than or equal sum
                    for(i = 0;i<_array.length;i++){
                        if(_array[i]<=sum){
                            r.push(_array[i]);
                        }else{
                            break;
                        }
                    }

                    return r;
                },
                //important function
                core: function(array,sum,arrayIndex,count,r){
                    var i = 0,
                        k = 0,
                        combArray = [],
                        _sum = 0,
                        _cca = [],
                        _cache = [];

                    if(count == _returnMark){
                        return;
                    }
                    //get current count combination
                    combArray = util.getCombination(arrayIndex,count);
                    for(i = 0;i<combArray.length;i++){
                        _cca = combArray[i];
                        _sum = 0;
                        _cache = [];
                        //calculate the sum from combination
                        for(k = 0;k<_cca.length;k++){
                            _sum += array[_cca[k]];
                            _cache.push(array[_cca[k]]);
                        }
                        if(Math.abs(_sum-sum) <= _tolerance){
                            r.push(_cache);
                        }
                    }

                    logic.core(array,sum,arrayIndex,count-1,r);
                }

            },
            r = [],
            _array = [],
            _targetCount = 0,
            _tolerance = 0,
            _returnMark = 0;

        //check data
        _targetCount = targetCount || _targetCount;
        _tolerance = tolerance || _tolerance;

        _array = logic.init(array,sum);
        if(_targetCount){
            _returnMark = _targetCount-1;
        }

        logic.core(_array,sum,util.getArrayIndex(_array),(_targetCount || _array.length),r);

        return r;
    },
});
