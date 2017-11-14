const KQCard = require('KQCard');
const KQCardFindTypeExtension = require('KQCardFindTypeExtension');
const AudioManager = require('AudioManager');
const play = require('play');

// 牌类型 component
//
cc.Class({
    extends: cc.Component,
    statics: {
        instances: null,
    },
    properties: {
        cardsLayout: cc.Layout,
        btnDuiZi: cc.Button,
        btnLiangDui: cc.Button,
        btnSanTiao: cc.Button,
        btnShunZi: cc.Button,
        btnTongHua: cc.Button,
        btnHuLu: cc.Button,
        btnTieZhi: cc.Button,
        btnTongHuaShun: cc.Button,
        typeButtonsNode: cc.Node,
        btnDeleteTouDao: cc.Button,   // 头道
        btnDeleteZhongDao: cc.Button, // 中道
        btnDeleteWeiDao: cc.Button,   // 尾道
        btnCancelAll: cc.Button,      // 全部取消
        btnDone: cc.Button,           // 确定出牌
        timeNode: cc.Node,
        labelTime: cc.Label,
        layoutTouDao: cc.Layout,
        layoutZhongDao: cc.Layout,
        layoutWeiDao: cc.Layout,

        cardPrefab: cc.Prefab,
        cardTypePrefab: cc.Prefab,
        gongXiNi:cc.Node,
        teShuPai:cc.Node,
        /*#####*/
        wuTong_img:cc.SpriteFrame,
        tongHuaShun_img:cc.SpriteFrame,
        BtnClickGongXiNiComfirm:false,  //用于检查用户是否点击了恭喜你页面的确定按钮
        /*#####*/

        _cardOffsetY: null,

        _kqCardModes: [],
        _allCardModes: [],
        _findCardTypeObject: null,  // 用来记录找到的牌型对象

        _finishSelectCardsCallback: null,
    },

    // use this for initialization
    onLoad: function () {
        this.BtnClickGongXiNiComfirm = false;
        this._cardOffsetY = 0;
        this._registerTouchEvents();
        this._registerDaosLayoutClickEvent();
        this.reset();
        // this.reloadCards(['4_1', '3_13', '4_12', '4_11', '4_10', '4_9', '2_9', '2_8', '2_7', '3_6', '2_6', '2_5', '3_5']);
    },

    /*#####点击空白地方将牌收回去*/
    onClickCardTypeCombineNode: function () {
        this._resetCardsPositionY();
    },

    _hideDeleteButtons: function () {
        this.btnDeleteTouDao.node.active = false;
        this.btnDeleteZhongDao.node.active = false;
        this.btnDeleteWeiDao.node.active = false;
    },

    // 重置，回到最初始有状态
    reset: function () {
        this._hideDeleteButtons();
        this.clearCards();
        this.timeStop();
        this._typeButtons().forEach(function (button) {
            button.interactable = false;
        });
        this._allCardModes = [];
    },

    addCards: function (cardNames) {
        //三度同花
        // cardNames=['2_13', '2_5', '2_7', '3_1', '3_2', '3_4', '3_3', '3_13', '1_12', '1_6', '1_1', '1_4', '1_5'];
        // cardNames=['1_13', '1_5', '1_7', '3_1', '3_2', '3_4', '3_3', '3_13', '1_12', '1_6', '1_1', '1_4', '1_5'];
        // cardNames=['4_2', '4_4', '4_6', '4_11', '4_12', '3_7', '3_13', '3_11', '1_1', '1_8', '1_10', '1_12', '1_13'];
        //三同花顺
        // cardNames=['2_1', '2_2', '2_3', '2_4', '2_5', '3_6', '3_7', '3_8', '3_9', '3_10', '4_1', '4_2', '4_3'];
        //一条龙
        // cardNames=['2_1', '2_2', '2_3', '2_4', '2_5', '3_6', '3_7', '3_8', '3_9', '3_10', '1_11', '1_12', '1_13'];
        //三顺子
        // cardNames=['3_5', '3_4', '4_3', '1_2', '3_1', '4_5', '3_6', '4_8', '3_9', '1_13', '4_12', '4_11', '2_7'];
        // cardNames=['4_1', '3_2', '4_3', '1_7', '4_5', '4_6', '3_9', '4_8', '3_1', '1_13', '4_12', '4_11', '2_10'];
        // cardNames=['3_5', '3_4', '4_3', '1_2', '3_1', '4_9', '3_9', '4_8', '3_10', '1_13', '4_12', '4_11', '2_10'];
        // cardNames=['1_1', '3_1', '4_3', '3_2', '2_9', '1_8', '3_7', '1_6', '4_5', '4_13', '4_12', '3_11', '3_10'];
        //cardNames=['1_1', '3_4', '4_3', '3_2', '2_5', '1_8', '3_7', '1_6', '4_6', '4_13', '4_12', '3_11', '3_10'];
        // cardNames=['3_5', '3_4', '4_3', '1_2', '3_1', '4_5', '3_9', '4_8', '3_6', '1_13', '4_12', '4_11', '2_7'];
        // cardNames=['3_5', '3_4', '4_3', '4_6', '3_1', '4_10', '3_7', '4_8', '3_9', '1_13', '4_12', '4_6', '2_7'];
        // cardNames=['4_9', '4_8', '4_9', '4_10', '4_5', '3_7', '3_6', '3_11', '1_1', '1_8', '1_10', '1_12', '1_13'];

        //三丰天下
        //cardNames=['1_1', '2_1', '3_1', '1_2', '2_2', '3_2', '4_1', '4_2', '3_3', '2_3', '1_3', '4_3', '1_13'];
        //4丰天下
        // cardNames=['1_1', '2_1', '3_1', '1_2', '2_2', '3_9', '4_9', '1_9', '3_6', '2_3', '1_3', '4_3', '1_6'];
        //六岁半是
        // cardNames=['1_1', '2_1', '3_11', '1_12', '2_2', '3_2', '4_11', '4_12', '3_13', '2_5', '1_13', '4_3', '1_3'];
        //  cardNames=['1_9', '2_11', '3_8', '1_12', '2_2', '3_2', '1_13', '2_5', '3_5','1_4', '2_4', '3_4', '3_10'];
        // cardNames=['4_9', '2_3', '3_4', '3_6', '2_1', '2_4', '2_2', '2_5', '2_13','2_8', '2_10', '2_11', '2_12'];
        // cardNames=['4_2', '2_3', '3_4', '3_5', '2_1', '2_4', '2_2', '2_5', '2_13','2_8', '2_10', '2_11', '2_12'];

         //cardNames=['4_9', '2_3', '3_4', '3_6', '2_8', '2_9', '2_10', '2_11', '2_13','2_1', '3_12', '2_12', '1_12'];
         cardNames=['3_1', '3_13', '4_12', '1_11', '3_10', '1_9', '4_5', '3_5', '1_5', '3_4', '2_4', '3_3', '3_2'];

        cc.assert(cardNames);
        this._resetCardsPositionY();
        cardNames.forEach(this.addCard.bind(this));
        this._resetCardsPositionX();
        this._reloadKQCardModesInner();
        this._resetTypeButtonEnablesWithModels(this._kqCardModes);
    },

    addCard: function (cardName, autoChangePositionX = false) {
        cc.assert(cardName.length > 0);

        let cardPrefab = cc.instantiate(this.cardPrefab);
        cardPrefab.name = cardName;
        cardPrefab.getComponent('CardPrefab').setCard(cardName);
        this.cardsLayout.node.addChild(cardPrefab);
        cardPrefab.setPositionY(this._cardOffsetY);

        if (autoChangePositionX) {
            this._resetCardsPositionX();
        }

        let newCard = new KQCard(cardName);
        let originCard = this._allCardModes.find(function(card) {
            return card.isEqual(newCard);
        });
        if (originCard == null) {
            this._allCardModes.push(newCard);
        }
    },

    reloadCards: function (cardNames) {
        //cardNames=['1_1', '2_1', '3_11', '1_12', '2_2', '3_2', '4_11', '4_12', '3_13', '2_5', '1_13', '4_3', '1_3'];
        // cardNames=['1_1', '2_1', '3_11', '1_12', '2_2', '3_2', '4_11', '4_12', '3_13', '2_5', '1_13', '4_3', '1_3'];
        //三度同花
        // cardNames=['2_13', '2_5', '2_7', '3_1', '3_2', '3_4', '3_3', '3_13', '1_12', '1_6', '1_1', '1_4', '1_5'];
        //三同花顺
        //  cardNames=['2_1', '2_2', '2_3', '2_4', '2_5', '3_6', '3_7', '3_8', '3_9', '3_10', '4_1', '4_2', '4_3'];
        //一条龙
        // cardNames=['2_1', '2_2', '2_3', '2_4', '2_5', '3_6', '3_7', '3_8', '3_9', '3_10', '1_11', '1_12', '1_13'];
        //三顺子
        //cardNames=['4_1', '3_2', '4_3', '1_7', '4_5', '4_6', '3_9', '4_8', '3_1', '1_13', '4_12', '4_11', '2_10'];
        // cardNames=['3_5', '3_4', '4_3', '1_2', '3_1', '4_9', '3_9', '4_8', '3_10', '1_13', '4_12', '4_11', '2_10'];
        // cardNames=['3_5', '3_4', '4_3', '1_2', '3_1', '4_5', '3_6', '4_8', '3_6', '1_13', '4_12', '4_11', '2_7'];
        //cardNames=['3_5', '3_4', '4_3', '1_2', '3_1', '4_5', '3_6', '4_8', '3_6', '1_13', '4_12', '4_11', '2_7'];
        //三丰天下
        //cardNames=['1_1', '2_1', '3_1', '1_2', '2_2', '3_2', '4_1', '4_2', '3_3', '2_3', '1_3', '4_3', '1_13'];
        //4丰天下
        // cardNames=['1_1', '2_1', '3_1', '1_4', '2_4', '3_2', '4_2', '1_2', '3_4', '2_3', '1_3', '4_3', '1_2'];
        //六岁半
        // cardNames=['1_1', '2_1', '3_11', '1_12', '2_2', '3_2', '4_11', '4_12', '3_13', '2_5', '1_13', '4_3', '1_3'];
        //cardNames=['1_9', '2_11', '3_8', '1_12', '2_2', '3_2', '1_13', '2_5', '3_5','1_4', '2_4', '3_4', '3_10'];
        // cardNames=['4_9', '2_3', '3_4', '3_6', '2_1', '2_4', '2_2', '2_5', '2_13','2_8', '2_10', '2_11', '2_12'];
        //   cardNames=['4_2', '2_3', '3_4', '3_5', '2_1', '2_4', '2_2', '2_5', '2_13','2_8', '2_10', '2_11', '2_12'];
        //cardNames=['4_1', '2_1', '1_4', '3_4', '1_6', '2_6', '1_8', '3_8', '2_8','2_12', '1_12', '2_13', '3_13'];
        // cardNames=['4_9', '2_3', '3_4', '3_6', '2_8', '2_9', '2_10', '2_11', '2_13','3_13', '3_12', '2_12', '1_12'];
        // cardNames=['4_9', '2_9', '3_4', '3_6', '1_8', '2_1', '2_5', '2_4', '2_3','3_13', '3_12', '2_2', '1_12'];
         //cardNames=['3_2', '4_2', '2_4', '3_5', '1_5', '3_7', '2_7', '3_10', '2_1','2_13', '2_10', '2_12', '2_11'];
        //cardNames=['4_2', '4_3', '4_4', '4_5', '4_5', '4_6', '4_12', '4_13', '2_12','3_12', '2_8', '3_8', '2_11'];
        cardNames=['4_3', '1_3', '4_5', '4_5', '3_5', '2_5', '1_8', '4_11', '3_12','4_12', '4_8', '4_1', '1_12'];
        this.clearCards();
        this._kqCardModes = [];
        this.addCards(cardNames);
    },

    clearCards: function () {
        this.cardsLayout.node.removeAllChildren();
        this.layoutTouDao.node.removeAllChildren();
        this.layoutZhongDao.node.removeAllChildren();
        this.layoutWeiDao.node.removeAllChildren();
    },

    removeCard: function (cardName) {
        if (!cardName.length) {
            return;
        }

        this.cardsLayout.node.getChildByName(cardName).removeFromParent();
    },

    setFinishSelectCardsCallback: function (callback) {
        this._finishSelectCardsCallback = callback;
        this.node.active = false;
    },

    _reloadKQCardModesInner: function () {
        this._kqCardModes = this.cardsLayout.node.children.map(function (cardPrefabNode) {
            let cardPrefab = cardPrefabNode.getComponent('CardPrefab');
            return cardPrefab.cardMode();
        }).sort(KQCard.sort);
        this._findCardTypeObject = null;
    },

    _typeButtons: function () {
        return [
            this.btnDuiZi,
            this.btnLiangDui,
            this.btnSanTiao,
            this.btnShunZi,
            this.btnTongHua,
            this.btnHuLu,
            this.btnTieZhi,
            this.btnTongHuaShun,
            /*#####*/
            //this.btnWuTong,
            /*#####*/
        ];
    },

    _resetTypeButtonEnablesWithModels: function (cardModes) {
        /*cardModes.length == 13*/
        cardModes = cardModes || this._kqCardModes;

        /*#####初始化牌*/
        var ButtonsLayoutChilds = this.typeButtonsNode.children;
        for(var i=0;i<ButtonsLayoutChilds.length;i++){
            ButtonsLayoutChilds[i].interactable = false;
        }

        this.btnDuiZi.interactable = KQCard.containDuiZi(cardModes);
        this.btnLiangDui.interactable = KQCard.containLiaDui(cardModes);
        this.btnSanTiao.interactable = KQCard.containSanTiao(cardModes);
        this.btnShunZi.interactable = KQCard.containShunZi(cardModes);
        this.btnTongHua.interactable = KQCard.containTongHua(cardModes);
        this.btnHuLu.interactable = KQCard.containHuLu(cardModes);
        this.btnTieZhi.interactable = KQCard.containTieZhi(cardModes);
        this.btnTongHuaShun.interactable = KQCard.containTongHuaShun(cardModes);
        //KQCard.isTeShuPai(cardModes)
        let typeName = KQCard.cardsTypeName(cardModes);
        //KQCard.isLiuDuiBan(cardModes);
        cc.log(typeName); cc.log('特殊牌name');
        //alert(this.btnShunZi.interactable)
        /*#####如果有多一色，就是设置无同按钮的可交互性*/
        if(cc.duoYiSe == 0) {
            this.wuTongNode = this.typeButtonsNode.getChildByName("btnWuTong");
            this.btnWuTong = this.wuTongNode.getComponent(cc.Button);
            this.btnWuTong.interactable = KQCard.containWuTong(cardModes);
        }
        /*#####*/

        this._autoActiveTypeButtons();

        /*#####设置按钮可交互和不可交互时的透明度*/
        for(var i=0;i<ButtonsLayoutChilds.length;i++){
            if(ButtonsLayoutChilds[i].getComponent(cc.Button).interactable){
                ButtonsLayoutChilds[i].opacity = 255;
            }else{
                ButtonsLayoutChilds[i].opacity = 125;
            }
        }
    },

    // 将找到了牌类型的牌突出出来
    _stickOutFindCardType: function (title, findMethods,isShunZi=false) {

        // 先根据牌类型找出所有的索引集合
        var findedIndexsArray = null;
        this._findCardTypeObject = this._findCardTypeObject || {};
        if (this._findCardTypeObject.title != title) {
            findedIndexsArray = (findMethods() || []).reverse();
            this._findCardTypeObject = {
                title: title,
                indexsArray: findedIndexsArray,
                //index: title=="duiZi"?findedIndexsArray.length-1:0
                index: 0
            };
        }

        findedIndexsArray = this._findCardTypeObject.indexsArray;
        if (!findedIndexsArray || findedIndexsArray.length == 0) {
            return;
        }

        // 将已有的突出的牌的位置重置回初始位置
        this._resetCardsPositionY();

        // 计算出要突出的牌数组
        var index = this._findCardTypeObject.index;
        let indexs = findedIndexsArray[index];

        let selectedCardNames = indexs.map(function(index){
            let cardModel = this._kqCardModes[index];
            return cardModel.cardName();
        }.bind(this));

        let cardNodes = this.cardsLayout.node.children.filter(function (cardNode) {
            let cardPrefab = cardNode.getComponent('CardPrefab');

            return selectedCardNames.includes(cardPrefab.cardName());
        });
        cc.log(cardNodes)
        /*有相同的牌则去重 1 1 2 3 4 5*/
        if(title == "shunZi" || title == "tongHuaShun" || title == "huLu" || title == "tongHua"){
            if(cardNodes.length > 5){
                for (var i = 0; i <= cardNodes.length; ++i) {
                    var si=cardNodes[i];
                    for (var j = i+1; j < cardNodes.length; ++j) {
                        var sj=cardNodes[j];
                        if(si.name==sj.name){
                            if(cardNodes.length <= 5){
                                break;
                            }
                            cardNodes.splice(j,1);
                        }
                    }
                }
            }
        }
        if(title == "tieZhi"){
            if(cardNodes.length > 4){
                for (var i = 0; i <= cardNodes.length; ++i) {
                    var si=cardNodes[i];
                    for (var j = i+1; j < cardNodes.length; ++j) {
                        var sj=cardNodes[j];
                        if(si.name==sj.name){
                            if(cardNodes.length <= 4){
                                break;
                            }
                            cardNodes.splice(j,1);
                        }
                    }
                }
            }
        }
        if(title == "sanTiao"){
            if(cardNodes.length > 3){
                for (var i = 0; i <= cardNodes.length; ++i) {
                    var si=cardNodes[i];
                    for (var j = i+1; j < cardNodes.length; ++j) {
                        var sj=cardNodes[j];
                        if(si.name==sj.name){
                            if(cardNodes.length <= 3){
                                break;
                            }
                            cardNodes.splice(j,1);
                        }
                    }
                }
            }
        }

        //cc.log('----------248')
        //cc.log(cardNodes)
        // 突出计算出来的牌数组
        this._changeCardPrefabsY(cardNodes);
        // 保存好，用于再次点击了突出下一组牌
        index = (index + 1) % findedIndexsArray.length;
        this._findCardTypeObject.index = index;
    },

    // 按钮点击事件
    clickDuiZi: function () {
        this._stickOutFindCardType("duiZi", function () {
            return KQCard.findDuiZi(this._kqCardModes);
        }.bind(this));
    },

    clickLiangDui: function () {
        this._stickOutFindCardType("liangDui", function () {
            return KQCard.findLiaDui(this._kqCardModes);
        }.bind(this));
    },

    clickSanTiao: function () {
        this._stickOutFindCardType("sanTiao", function () {
            return KQCard.findSanTiao(this._kqCardModes);
        }.bind(this));
    },

    clickShunZi: function () {
        this._stickOutFindCardType("shunZi", function () {
            return KQCard.findShunZi(this._kqCardModes);
        }.bind(this),true);
    },

    clickTongHua: function () {
        this._stickOutFindCardType("tongHua", function () {
            return KQCard.findTongHua(this._kqCardModes);
        }.bind(this));
    },

    clickHuLu: function () {
        this._stickOutFindCardType("huLu", function () {
            return KQCard.findHuLu(this._kqCardModes);
        }.bind(this));
    },

    clickTieZhi: function () {
        this._stickOutFindCardType("tieZhi", function () {
            return KQCard.findTieZhi(this._kqCardModes);
        }.bind(this));
    },

    /*#####*/
    clickWuTong: function () {
        console.log("点击了五同按钮");
        this._stickOutFindCardType("WuTong", function () {
            return KQCard.findWuTong(this._kqCardModes);
        }.bind(this));
    },
    /*#####*/

    clickTongHuaShun: function () {
        this._stickOutFindCardType("tongHuaShun", function () {
            return KQCard.findTongHuaShun(this._kqCardModes);
        }.bind(this));
    },

    clickCancelAll: function () {
        this.clickDeleteTouDao();
        this.clickDeleteZhongDao();
        this.clickDeleteWeiDao();
    },

    /*点击完成按钮*/
    clickDone: function () {
        let touCardModels = this._taoDaoCardModes();
        let zhongCardModes = this._zhongDaoCardModes();
        let weiCardModes = this._weiDaoCardModes();
        this._didSelectedCards(touCardModels, zhongCardModes, weiCardModes);
    },

    /*点击恭喜你页面的确定按钮*/
    onBtnGongXiNiComfirmClick:function () {
        //记录玩家点击了确定按钮：
        this.BtnClickGongXiNiComfirm = true;
        //先要得到玩家的13张牌 teShuPaiCards[{'number':1,'suit':'s'},{...},{...}]
        var teShuPaiCards = cc.teShuPaiCards;
        console.log(teShuPaiCards);
        var teShuPaiCardsServerInfo = this._convertCardsToServerModel2(teShuPaiCards);
        var result = [teShuPaiCardsServerInfo];
        console.log("点击了恭喜你页面的确定按钮");
        console.log(teShuPaiCardsServerInfo);
        if (this._finishSelectCardsCallback) {
            this._finishSelectCardsCallback(result);
        }
    },

    _didSelectedCards: function (touCards, zhongCards, weiCards) {
        let touServerInfo = this._convertCardsToServerModel(touCards);
        let zhongServerInfo = this._convertCardsToServerModel(zhongCards);
        let weiServerInfo = this._convertCardsToServerModel(weiCards);
        let result = [touServerInfo, zhongServerInfo, weiServerInfo];
        //var a=[];
        //for(var i=0;i<touCards.length;i++){
        //    var t=touCards[i];
        //    a.push(t);
        //}
        //for(var i=0;i<zhongCards.length;i++){
        //    var t=zhongCards[i];
        //    a.push(t);
        //}
        //for(var i=0;i<weiCards.length;i++){
        //    var t=weiCards[i];
        //    a.push(t);
        //}
        //var aa = this._convertCardsToServerModel(a);
        //var cards = KQCard._convertCardsToCardNames(a);
        ////cc.log(result)
        ////cc.log(aa.type)
        ////cc.log(1111111111)
        ////cc.log(aa)
        //if(aa.type>9){
        //    result=[aa];
        //    cc.log(result[0]['type'])
        //}
        if (this._finishSelectCardsCallback) {
            this._finishSelectCardsCallback(result);
        }
    },

    clickDeleteTouDao: function () {
        this._deleteDaoCardsOfLayout(this.layoutTouDao.node);
    },

    clickDeleteZhongDao: function () {
        this._deleteDaoCardsOfLayout(this.layoutZhongDao.node);
    },

    clickDeleteWeiDao: function () {
        this._deleteDaoCardsOfLayout(this.layoutWeiDao.node);
    },

    // 计时器事件
    timeStart: function (duration) {
        cc.assert(duration > 0);
        this.timeStop();
        this.timeNode.active = true;

        this._timeRemainDuration = duration;
        this.labelTime.string = String(duration);
        this.schedule(this._timeMethod, 1, duration);
    },

    timeStop: function () {
        this.unschedule(this._timeMethod);
        this.timeNode.active = false;
    },

    _timeMethod: function () {
        this._timeRemainDuration = this._timeRemainDuration - 1;

        var remain = Math.max(this._timeRemainDuration, 0);
        this.labelTime.string = (remain < 10 && remain > 0) ? ('0' + remain) : remain;

        if (this._timeRemainDuration <= 0) {
            this.timeStop();
            this._timeOutAutoSelectCards();
            return;
        }
    },

    // 超时后，自动选牌
    _timeOutAutoSelectCards: function () {
        /**
         * 隐藏恭喜你
         */
        play.gongXiNiShow(false);
        if (typeof(cc.teShuPaiCards) != "undefined" && cc.teShuPaiCards != null && cc.teShuPaiCards != '') {
            this.onBtnGongXiNiComfirmClick();
            return;
        }

        let [touCardModels, zhongCardModes, weiCardModes] = this._cacleAutoSelectedCards();
        cc.log(touCardModels)
        cc.log(zhongCardModes)
        cc.log(weiCardModes)
        cc.log("自动选牌 touCardModels zhongCardModes weiCardModes：");
        if (touCardModels == null || zhongCardModes == null || weiCardModes == null) {
            touCardModels = this._allCardModes.slice(-3);
            zhongCardModes = this._allCardModes.slice(5, 10);
            weiCardModes = this._allCardModes.slice(0, 5);
        }

        this._didSelectedCards(touCardModels, zhongCardModes, weiCardModes);
    },

    _cacleAutoSelectedCards: function() {
        let cards = this._allCardModes.slice();
        var resultCards = [];
        for(var i = 1;i < 3; i++){
            let cardss = KQCard.autoSelectCards(cards, 5 );
            cards = cards.kq_excludes(cardss);
            resultCards.push(cardss);
        }
        resultCards.push(cards);
        let touScore = KQCard.scoreOfCards(resultCards[2]);
        let zhongScore = KQCard.scoreOfCards(resultCards[1]);
        let weiScore = KQCard.scoreOfCards(resultCards[0]);
        cc.log(resultCards)
        cc.log("牌分数自动选牌：", touScore, zhongScore, weiScore);
        //let weiCardModes = KQCard.autoSelectCards(cards, 5);
        //cards = cards.kq_excludes(weiCardModes);
        //
        //let zhongCardModes = KQCard.autoSelectCards(cards, 5);
        //
        //let touCardModes = cards.kq_excludes(zhongCardModes);
        //if (touCardModes.length == 3 && zhongCardModes.length == 5 && weiCardModes.length == 5) {
        //    return [touCardModes, zhongCardModes, weiCardModes];
        //}
        if (resultCards[2].length == 3 && resultCards[1].length == 5 && resultCards[0].length == 5) {
            return [resultCards[2], resultCards[1], resultCards[0]];
        }

        return [];
    },

    _convertCardsToServerModel: function (cards) {
        let result = {};
        result.type = KQCard.cardsType(cards);
        result.value = KQCard.scoreOfCards(cards);
        if (result.type >= KQCard.TYPE.SanTaoHua && cc.moshi != 1) {
            // 特殊牌
            result.isContainExtra = this._isContainExtraCardsType(result.type, cards);
            //result.isContainExtra = true;
            result.cards = cards;
        } else {
            result.cards = KQCard.convertToServerCards(cards);
        }
        return result;
    },

    /*#####*/
    _convertCardsToServerModel2: function (cards) {
        let result = {};
        result.type = KQCard.cardsType(cards);
        result.value = KQCard.scoreOfCards2(cards);
        if (result.type >= KQCard.TYPE.SanTaoHua && cc.moshi != 1) {
            // 特殊牌
            result.isContainExtra = true;
            result.cards = cards;
        }

        return result;
    },
    /*#####*/
    // 特殊牌里是否还含有特殊牌
    // 包含的情况有：
    // 三桃花 可能含有同花顺
    // 三顺子 可能含有同花顺
    // 六对半 可能含有铁支
    _isContainExtraCardsType: function (type, cards) {
        if (type == KQCard.TYPE.SanTaoHua) {
            return KQCard.containTongHuaShun(cards);
        } else if (type == KQCard.TYPE.SanShunZi) {
            return KQCard.containTongHuaShun(cards);
        } else if (type == KQCard.TYPE.LiuDuiBan) {
            return KQCard.containTieZhi(cards);
        }
        return false;
    },

    // 触摸事件
    _registerTouchEvents: function () {
        this.cardsLayout.node.on(cc.Node.EventType.TOUCH_START, this._touchCardLayout.bind(this));
        this.cardsLayout.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchCardLayout.bind(this));
        this.cardsLayout.node.on(cc.Node.EventType.TOUCH_END, this._touchCardLayoutEnd.bind(this));
        this.cardsLayout.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCardLayoutEnd.bind(this));
    },

    _touchCardLayout: function (event) {
        event.bubbles = true;
        let location = event.getLocation();
        let cardPrefab = this._cardPrefabInCardLayoutWithLocation(location);
        if (cardPrefab) {
            cardPrefab.getComponent('CardPrefab').setSelected(true);
            event.stopPropagation();
        }
    },

    _touchCardLayoutEnd: function (event) {
        this._changeSelectedCardPrefabsY();
        this._diseclectCardPrefabs();
    },

    _cardPrefabInCardLayoutWithLocation: function (location) {
        location = this.cardsLayout.node.convertToNodeSpaceAR(location);
        let cardNodes = this.cardsLayout.node.children.sort(function (cardNode1, cardNode2) {
            let rect1 = cardNode1.getBoundingBox();
            let rect2 = cardNode2.getBoundingBox();
            return rect2.x - rect1.x;
        });
        for (let index in cardNodes) {
            let cardNode = cardNodes[index];

            let rect = cardNode.getBoundingBox();

            if (cc.rectContainsPoint(rect, location)) {
                return cardNode;
            }
        }

        return null;
    },

    _changeSelectedCardPrefabsY: function () {
        let cardNodes = this._selectedCardPrefabs();
        this._changeCardPrefabsY(cardNodes);

        AudioManager.instance.playPokerClick();
    },

    _changeCardPrefabsY: function (cardNodes) {
        cardNodes.forEach(function (cardNode) {
            let y = cardNode.getPositionY();
            if (y == this._cardOffsetY) {
                cardNode.setPositionY(this._cardOffsetY + 55);
            } else {
                cardNode.setPositionY(this._cardOffsetY);
            }
        }.bind(this));
    },

    _selectedCardPrefabs: function (includeStickOut = false) {
        let cardNodes = this.cardsLayout.node.children || [];
        return cardNodes.filter(function (cardNode) {
            let cardPrefab = cardNode.getComponent('CardPrefab');
            let isSelected = cardPrefab.isSelected();
            if (!isSelected && includeStickOut) {
                isSelected = cardNode.getPositionY() > 10;
            }

            return isSelected;
        });
    },

    _diseclectCardPrefabs: function () {
        let cardNodes = this.cardsLayout.node.children;
        cardNodes.forEach(function (node) {
            node.getComponent('CardPrefab').setSelected(false);
        });
    },

    // 重置 cards 的 X
    _resetCardsPositionX: function () {
        let interval = 98;
        let cardNodes = this.cardsLayout.node.children || [];
        let length = cardNodes.length;
        if (length == 0) {
            return;
        }

        let middleIndex = length / 2;
        let cardWidth = 154;

        cardNodes.sort(function (n1, n2) {
            let component1 = n1.getComponent('CardPrefab');
            let component2 = n2.getComponent('CardPrefab');

            return component1.cardMode().sort(component2.cardMode());
        });

        cardNodes.forEach(function (cardNode, index) {
            cardNode.zIndex = index;
            let x = (index - middleIndex) * interval + cardWidth / 3;
            cardNode.setPositionX(x);
        });
    },

    _resetCardsPositionY: function () {
        let cardNodes = this.cardsLayout.node.children || [];
        cardNodes.forEach(function (cardNode) {
            cardNode.setPositionY(this._cardOffsetY);
        }.bind(this));
    },

    // 头、中、尾道 layout 的点击事件
    _registerDaosLayoutClickEvent: function () {
        var layoutTouDao = this.layoutTouDao;
        var layoutZhongDao = this.layoutZhongDao;
        var layoutWeiDao = this.layoutWeiDao;
        var self = this;
        //头道点击
        this.layoutTouDao.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this._clickTouDaoLayout(event);
            /*#####点击第二道剩下的牌自动选上去##### begin*/
            //如果剩下的牌小于5张
            if(this.cardsLayout.node.children.length <= 5){
                //如果尾道填满，把它放入中道
                if(layoutZhongDao.node.children.length < 5 && layoutWeiDao.node.children.length == 5){
                    // 突出计算出来的牌数组
                    var cardNodes = this.cardsLayout.node.children;
                    self._changeCardPrefabsY(cardNodes);
                    self._addDaoCardToLayout(layoutZhongDao.node);
                }
                //如果中道填满，把它放入尾道
                else if(layoutWeiDao.node.children.length < 5 && layoutZhongDao.node.children.length == 5) {
                    var cardNodes = this.cardsLayout.node.children;
                    self._changeCardPrefabsY(cardNodes);
                    self._addDaoCardToLayout(layoutWeiDao.node);
                }
            }
            /*#####end*/
        }.bind(this));
        //中道点击
        this.layoutZhongDao.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this._clickZhongDaoLayout(event);
            /*#####begin*/
            //中道必须填满才来执行
            if(layoutZhongDao.node.children.length == 5){
                //如果剩下的牌小于等于5张
                if(this.cardsLayout.node.children.length <= 5){
                    //如果尾道填满，把它放入头道
                    if(layoutTouDao.node.children.length < 3 && layoutWeiDao.node.children.length == 5){
                        // 突出计算出来的牌数组
                        var cardNodes = this.cardsLayout.node.children;
                        self._changeCardPrefabsY(cardNodes);
                        self._addDaoCardToLayout(layoutTouDao.node);
                    }
                    //如果头道填满，把它放入尾道
                    else if(layoutWeiDao.node.children.length < 5 && layoutTouDao.node.children.length == 3) {
                        var cardNodes = this.cardsLayout.node.children;
                        self._changeCardPrefabsY(cardNodes);
                        self._addDaoCardToLayout(layoutWeiDao.node);
                    }
                }
            }

            /*#####end*/
        }.bind(this));
        //尾道点击
        this.layoutWeiDao.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this._clickWeiDaoLayout(event);
            /*#####begin*/
            //尾道必须填满才来执行
            if(layoutWeiDao.node.children.length == 5){
                //如果剩下的牌小于等于5张
                if(this.cardsLayout.node.children.length <= 5){
                    //如果中道填满，把它放入头道
                    if(layoutTouDao.node.children.length < 3 && layoutZhongDao.node.children.length == 5){
                        // 突出计算出来的牌数组
                        var cardNodes = this.cardsLayout.node.children;
                        self._changeCardPrefabsY(cardNodes);
                        self._addDaoCardToLayout(layoutTouDao.node);
                    }
                    //如果头道填满，把它放入中道
                    else if(layoutZhongDao.node.children.length < 5 && layoutTouDao.node.children.length == 3) {
                        var cardNodes = this.cardsLayout.node.children;
                        self._changeCardPrefabsY(cardNodes);
                        self._addDaoCardToLayout(layoutZhongDao.node);
                    }
                }
            }

            /*#####end*/
        }.bind(this));
    },

    _clickTouDaoLayout: function (event) {
        let clickCard = this._daoCardNodeInLayoutWithEvent(this.layoutTouDao.node, event);
        if (clickCard) {
            this._deleteDaoCard(clickCard, true);
            return;
        }

        this._addDaoCardToLayout(this.layoutTouDao.node, 3);
    },

    _clickZhongDaoLayout: function (event) {
        let clickCard = this._daoCardNodeInLayoutWithEvent(this.layoutZhongDao.node, event);
        if (clickCard) {
            this._deleteDaoCard(clickCard, true);
            return;
        }

        this._addDaoCardToLayout(this.layoutZhongDao.node);
    },

    _clickWeiDaoLayout: function (event) {
        let clickCard = this._daoCardNodeInLayoutWithEvent(this.layoutWeiDao.node, event);
        if (clickCard) {
            this._deleteDaoCard(clickCard, true);
            return;
        }

        this._addDaoCardToLayout(this.layoutWeiDao.node);
    },

    _daoCardNodeInLayoutWithEvent: function (node, event) {
        let cardNodes = node.children || [];
        var location = event.getLocation();
        location = node.convertToNodeSpaceAR(location);

        for (let index in cardNodes) {
            let cardNode = cardNodes[index];
            let rect = cardNode.getBoundingBox();
            if (cc.rectContainsPoint(rect, location)) {
                return cardNode;
            }
        }

        return null;
    },

    _addDaoCardToLayout: function (node, maxNumberCard = 5) {
        let cardNodes = node.children || [];
        if (cardNodes.length >= 5) {
            return;
        }

        let remainCount = maxNumberCard - cardNodes.length;
        var selectedCards = this._selectedCardPrefabs(true) || [];
        if (selectedCards.length == 0) {
            return;
        }

        if (selectedCards.length > remainCount) {
            selectedCards = selectedCards.slice(0, remainCount);
        }

        let selectedCardNames = selectedCards.map(function (cardPrefab) {
            return cardPrefab.getComponent('CardPrefab').cardName();
        });

        cardNodes.forEach(function (cardTypeNode) {
            selectedCardNames.push(cardTypeNode.getComponent('CardTypeSprite').cardName());
        });

        let cardModes = selectedCardNames.map(function (cardName) {
            return new KQCard(cardName);
        }).sort(function (c1, c2) {
            return KQCard.sort(c1, c2, false);
        });

        let touCardModes = (node == this.layoutTouDao.node) ? cardModes : this._taoDaoCardModes();
        let zhongCardModes = (node == this.layoutZhongDao.node) ? cardModes : this._zhongDaoCardModes();
        let weiCardModes = (node == this.layoutWeiDao.node) ? cardModes : this._weiDaoCardModes();
        if (!this._isValidCardModes(touCardModes, zhongCardModes, weiCardModes)) {
            return;
        }

        node.removeAllChildren();

        cardModes.forEach(function (cardMode) {
            let cardName = cardMode.cardName();
            let cardTypeSprite = cc.instantiate(this.cardTypePrefab);
            cardTypeSprite.getComponent('CardTypeSprite').setCard(cardName);
            node.addChild(cardTypeSprite);
        }.bind(this));

        selectedCards.forEach(function (node) {
            node.removeFromParent();
        });
        this._resetCardsPositionY();
        this._resetCardsPositionX();

        this._autoActiveDeleteDaoButtons();

        this._reloadKQCardModesInner();
        this._resetTypeButtonEnablesWithModels();
    },

    // 删除 头、中或尾道中的某中牌
    _deleteDaoCard: function (cardTypeNode, reloadTypeButtonEnables = false) {
        let cardName = cardTypeNode.getComponent('CardTypeSprite').cardName();
        this.addCard(cardName, true);

        this._resetCardsPositionY();

        cardTypeNode.removeFromParent(true);
        this._autoActiveDeleteDaoButtons();

        if (reloadTypeButtonEnables) {
            this._reloadKQCardModesInner();
            this._resetTypeButtonEnablesWithModels();
        }
    },

    // 删除 头道或中道或尾道上所有的 牌
    _deleteDaoCardsOfLayout: function (daoLayout) {
        let cardNodes = Array.from(daoLayout.children);
        cardNodes.forEach(this._deleteDaoCard.bind(this));

        this._reloadKQCardModesInner();
        this._resetTypeButtonEnablesWithModels();
    },

    // 判断能否使用选择中的牌
    // 即：头道要小于中道、中道要小于尾道
    _isValidCardModes: function (touCardModes, zhongCardModes, weiCardModes) {
        touCardModes = touCardModes || [];
        zhongCardModes = zhongCardModes || [];
        weiCardModes = weiCardModes || [];
        cc.log(touCardModes.length, zhongCardModes.length, weiCardModes.length);
        if (touCardModes.length < 3 || zhongCardModes.length < 5 || weiCardModes.length < 5) {
            return true;
        }

        let touScore = KQCard.scoreOfCards(touCardModes);
        let zhongScore = KQCard.scoreOfCards(zhongCardModes);
        let weiScore = KQCard.scoreOfCards(weiCardModes);
        cc.log("牌分数：", touScore, zhongScore, weiScore);
        return (touScore < zhongScore) && (zhongScore <= weiScore);
    },

    // 头道上已有的牌
    _taoDaoCardModes: function () {
        return this._cardModesOfCardPrefabs(this.layoutTouDao.node.children);
    },

    // 中道上已有的牌
    _zhongDaoCardModes: function () {
        return this._cardModesOfCardPrefabs(this.layoutZhongDao.node.children);
    },

    // 尾道上已有的牌
    _weiDaoCardModes: function () {
        return this._cardModesOfCardPrefabs(this.layoutWeiDao.node.children);
    },

    _cardModesOfCardPrefabs: function (cardTypeNodes) {
        if (!cardTypeNodes) {
            return [];
        }

        let cardModes = cardTypeNodes.map(function (node) {
            let component = node.getComponent('CardTypeSprite');
            return component.cardMode();
        });

        return cardModes || [];
    },

    // 自动设置 头、中、尾道的删除按钮的可见性
    _autoActiveDeleteDaoButtons: function () {
        this._autoActiveDeleteDaoButton(this.layoutTouDao.node, this.btnDeleteTouDao.node);
        this._autoActiveDeleteDaoButton(this.layoutZhongDao.node, this.btnDeleteZhongDao.node);
        this._autoActiveDeleteDaoButton(this.layoutWeiDao.node, this.btnDeleteWeiDao.node);
    },

    _autoActiveDeleteDaoButton: function (layout, button) {
        button.active = layout.children.length > 0;
    },

    // 自动设置 “全部取消”、“确定出牌”、“类型选择”按钮的可见性
    _autoActiveTypeButtons: function () {
        let cardNodes = this.cardsLayout.node.children || [];
        let hasCardUnSelected = cardNodes.length > 0;
        this.btnDone.node.active = !hasCardUnSelected;
        this.btnCancelAll.node.active = this.btnDone.node.active;
        this.typeButtonsNode.active = hasCardUnSelected;
    },

});
