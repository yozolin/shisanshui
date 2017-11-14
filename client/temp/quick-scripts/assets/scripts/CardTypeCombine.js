(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/CardTypeCombine.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '45c41vwAhFNYYSXDvaKpEP0', 'CardTypeCombine', __filename);
// scripts/CardTypeCombine.js

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var KQCard = require('KQCard');
var KQCardFindTypeExtension = require('KQCardFindTypeExtension');
var AudioManager = require('AudioManager');
var play = require('play');
var KQCardScoretsHelper = require('KQCardScoretsHelper');
// 牌类型 component
//
cc.Class({
    extends: cc.Component,
    statics: {
        instances: null
    },
    properties: {
        cardsLayout: cc.Layout,
        // btnDuiZi: cc.Button,
        // btnLiangDui: cc.Button,
        // btnSanTiao: cc.Button,
        // btnShunZi: cc.Button,
        // btnTongHua: cc.Button,
        // btnHuLu: cc.Button,
        // btnTieZhi: cc.Button,
        // btnTongHuaShun: cc.Button,
        // btnWuTong: cc.Button,
        // typeButtonsNode: cc.Node,
        btnDeleteTouDao: cc.Button, // 头道
        btnDeleteZhongDao: cc.Button, // 中道
        btnDeleteWeiDao: cc.Button, // 尾道
        btnCancelAll: cc.Button, // 全部取消
        btnDone: cc.Button, // 确定出牌
        timeNode: cc.Node,
        labelTime: cc.Label,
        layoutTouDao: cc.Layout,
        layoutZhongDao: cc.Layout,
        layoutWeiDao: cc.Layout,
        cardAllNode: cc.Node,
        cardPrefab: cc.Prefab,
        cardTypePrefab: cc.Prefab,

        touDaoNode: cc.Node,
        zhongDaoNode: cc.Node,
        weiDaoNode: cc.Node,

        autoCardScrollView: cc.ScrollView,
        autoCard: cc.Prefab,
        autoCardLayout: cc.Layout,
        autoCardAnimation: cc.Node,

        LayoutWithEvent: [],

        BtnClickGongXiNiComfirm: false, //用于检查用户是否点击了恭喜你页面的确定按钮
        cardsLayoutSortColor: false,
        /*#####*/

        _cardOffsetY: null,

        _kqCardModes: [],
        _allCardModes: [],
        _findCardTypeObject: null, // 用来记录找到的牌型对象
        _findCardIndex: null, // 用来记录找到的牌型对象

        _finishSelectCardsCallback: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.BtnClickGongXiNiComfirm = false;
        this.cardsLayoutSortColor = false;
        this._cardOffsetY = 0;
        this._registerTouchEvents();
        this._registerDaosLayoutClickEvent();
        this.reset();
        this._findCardIndex = {};
        this.cardTime = 0.3;

        this.cardSpriteAtlas = this.node.parent.getComponent('play').cardSpriteAtlas;
        this.daoSpriteAtlas = this.node.parent.getComponent('play').daoSpriteAtlas;
    },

    /*#####点击空白地方将牌收回去*/
    onClickCardTypeCombineNode: function onClickCardTypeCombineNode() {
        this._resetCardsPositionY();
    },

    _hideDeleteButtons: function _hideDeleteButtons() {
        //this.btnDeleteTouDao.node.active = false;
        //this.btnDeleteZhongDao.node.active = false;
        //this.btnDeleteWeiDao.node.active = false;
    },

    // 重置，回到最初始有状态
    reset: function reset() {
        this._hideDeleteButtons();
        this.clearCards();
        this.timeStop();
        //this._typeButtons().forEach(function (button) {
        //    button.interactable = false;
        //});
        this._allCardModes = [];
    },

    cardsLayoutSort: function cardsLayoutSort(e) {
        var nodeAyy = e.target.children;
        if (nodeAyy[0].active == true) {
            //按大小
            this.cardsLayoutSortColor = true;
            nodeAyy[0].active = false;
            nodeAyy[1].active = true;
            this._resetCardsPositionX();
            return;
        } else if (nodeAyy[1].active == true) {
            //按花色
            this.cardsLayoutSortColor = false;
            nodeAyy[0].active = true;
            nodeAyy[1].active = false;
            this._resetCardsPositionX();
        }
        //this.cardsLayoutSortColor = nodeAyy[1].active == false;
        //this.cardsLayoutSortColor == true
    },

    addCards: function addCards(cardNames) {
        cc.assert(cardNames);
        this._resetCardsPositionY();
        //cardNames.sort(function(a1,a2){
        //    return a1.split('_')[0] - a2.split('_')[0];
        //})
        cardNames.forEach(function (card, index) {
            this.addCard(card, false, index);
        }.bind(this));
        //this.cardsLayoutSort();
        this._resetCardsPositionX();
        this._reloadKQCardModesInner();
        this._resetTypeButtonEnablesWithModels(this._kqCardModes);
    },

    addCard: function addCard(cardName) {
        var autoChangePositionX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        cc.assert(cardName.length > 0);

        var cardPrefab = cc.instantiate(this.cardPrefab);
        cardPrefab.name = cardName;
        // if(cc.maPai){
        //     var cardMaPai = '3_' + cc.maPai;
        //     if(cardName == cardMaPai){
        //         cardPrefab.color = new cc.Color(226, 145, 145);
        //     }
        // }
        cardPrefab.getComponent('CardPrefab').setCard(cardName, index);
        this.cardsLayout.node.addChild(cardPrefab);
        cardPrefab.setPositionY(this._cardOffsetY);

        if (autoChangePositionX) {
            this._resetCardsPositionX();
        }
        //let newCard = new KQCard(cardName,null,index);
        //let originCard = this._allCardModes.find(function(card) {
        //    return card.isEqual(newCard);
        //});
        //if (originCard == null && !autoChangePositionX) {
        //    this._allCardModes.push(newCard);
        //}
    },

    addCardModes: function addCardModes(cardNames) {
        cc.assert(cardNames.length > 0);
        this._allCardModes = [];
        cardNames.forEach(function (cardName, index) {
            var newCard = new KQCard(cardName, null, index);
            this._allCardModes.push(newCard);
        }.bind(this));
    },

    reloadCards: function reloadCards(cardNames) {
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
        //cardNames=['3_4', '3_4', '4_6', '2_20', '1_20', '1_20', '3_6', '4_8', '3_6', '1_8', '4_12', '4_11', '2_20'];
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
        //cardNames=['4_3', '1_3', '4_5', '4_5', '3_5', '2_5', '1_20', '4_11', '3_12','4_12', '4_8', '4_1', '1_12'];
        //cardNames=['4_3', '1_3', '4_5', '4_5', '2_20', '1_20', '1_20', '4_11', '3_12','4_12', '4_8', '4_1', '1_12'];
        //cardNames=['4_3', '3_4', '4_6', '4_5', '2_7', '1_20', '1_3', '4_4', '3_6','4_7', '4_8', '2_12', '1_12'];
        cc.log(cardNames);
        this.clearCards();
        this._kqCardModes = [];
        this.addCards(cardNames);
    },

    clearCards: function clearCards() {
        this.cardsLayout.node.removeAllChildren();
        this.layoutTouDao.node.removeAllChildren();
        this.layoutZhongDao.node.removeAllChildren();
        this.layoutWeiDao.node.removeAllChildren();
    },

    removeCard: function removeCard(cardName) {
        if (!cardName.length) {
            return;
        }

        this.cardsLayout.node.getChildByName(cardName).removeFromParent();
    },

    setFinishSelectCardsCallback: function setFinishSelectCardsCallback(callback) {
        this._finishSelectCardsCallback = callback;
        this.node.active = false;
    },

    _reloadKQCardModesInner: function _reloadKQCardModesInner() {
        //this._kqCardModes = this.cardsLayout.node.children.map(function (cardPrefabNode) {
        //    let cardPrefab = cardPrefabNode.getComponent('CardPrefab');
        //    return cardPrefab.cardMode();
        //}).sort(KQCard.sort);
        //this._findCardTypeObject = null;
    },

    _typeButtons: function _typeButtons() {
        //return [
        //    this.btnDuiZi,
        //    this.btnLiangDui,
        //    this.btnSanTiao,
        //    this.btnShunZi,
        //    this.btnTongHua,
        //    this.btnHuLu,
        //    this.btnTieZhi,
        //    this.btnTongHuaShun,
        //    /*#####*/
        //    //this.btnWuTong,
        //    /*#####*/
        //];
    },

    _resetTypeButtonEnablesWithModels: function _resetTypeButtonEnablesWithModels(cardModes) {
        /*cardModes.length == 13*/
        //cardModes = cardModes || this._kqCardModes;
        //
        ///*#####初始化牌*/
        //var ButtonsLayoutChilds = this.typeButtonsNode.children;
        //for(var i=0;i<ButtonsLayoutChilds.length;i++){
        //    ButtonsLayoutChilds[i].interactable = false;
        //}
        //
        //this.btnDuiZi.interactable = KQCard.containDuiZi(cardModes);
        //this.btnLiangDui.interactable = KQCard.containLiaDui(cardModes);
        //this.btnSanTiao.interactable = KQCard.containSanTiao(cardModes);
        //this.btnShunZi.interactable = KQCard.containShunZi(cardModes);
        //this.btnTongHua.interactable = KQCard.containTongHua(cardModes);
        //this.btnHuLu.interactable = KQCard.containHuLu(cardModes);
        //this.btnTieZhi.interactable = KQCard.containTieZhi(cardModes);
        //this.btnTongHuaShun.interactable = KQCard.containTongHuaShun(cardModes);
        ////this.btnWuTong.interactable = KQCard.containWuTong(cardModes);
        ////KQCard.isTeShuPai(cardModes)
        ////let typeName = KQCard.cardsTyp-eName(cardModes);
        ////KQCard.isLiuDuiBan(cardModes);
        ////alert(this.btnShunZi.interactable)
        ///*#####如果有多一色，就是设置无同按钮的可交互性*/
        ////if(cc.duoYiSe == 0) {
        ////    this.wuTongNode = this.typeButtonsNode.getChildByName("btnWuTong");
        ////    this.btnWuTong = this.wuTongNode.getComponent(cc.Button);
        ////    this.btnWuTong.interactable = KQCard.containWuTong(cardModes);
        ////}
        ///*#####*/
        //
        //this._autoActiveTypeButtons();
        //
        ///*#####设置按钮可交互和不可交互时的透明度*/
        //for(var i=0;i<ButtonsLayoutChilds.length;i++){
        //    if(ButtonsLayoutChilds[i].getComponent(cc.Button).interactable){
        //        ButtonsLayoutChilds[i].opacity = 255;
        //    }else{
        //        ButtonsLayoutChilds[i].opacity = 125;
        //    }
        //}
    },

    // 将找到了牌类型的牌突出出来
    _stickOutFindCardType: function _stickOutFindCardType(title, findMethods) {

        // 先根据牌类型找出所有的索引集合
        //var findedIndexsArray = null;
        //this._findCardTypeObject = this._findCardTypeObject || {};
        //if (this._findCardTypeObject.title != title) {
        //    findedIndexsArray = (findMethods() || []).reverse();
        //
        //    for(var i =0;i<findedIndexsArray.length-1;i++){//删除同类型牌
        //        var index = findedIndexsArray[i];
        //        /*if(title == 'liangDui'){
        //         let jStringspoint = index.map(function(indexs){
        //         return this._kqCardModes[indexs].point;
        //         }.bind(this));
        //         var isBreak = false;
        //         var repNum = jStringspoint.reduce(function(p,n){
        //         if(!p[n]){
        //         p[n] = 1;
        //         }else{
        //         p[n] += 1
        //         }
        //         return p
        //         },{});
        //         for(var y in repNum){
        //         if(repNum[y] >= 3){
        //         isBreak = true;
        //         }
        //         }
        //         if(isBreak){
        //         cc.log(repNum)
        //         cc.log(findedIndexsArray)
        //         cc.log(i)
        //         cc.log('--------291')
        //         findedIndexsArray.splice(i,1);
        //         continue;
        //         }
        //         }*/
        //        var iString = '';
        //        for(var j =i+1;j<findedIndexsArray.length;j++){
        //            var s = findedIndexsArray[j];
        //            var jString = '';
        //
        //            let iStrings = s.map(function(index){
        //                let cardModel = this._kqCardModes[index];
        //                return cardModel.cardName();
        //            }.bind(this));
        //
        //            let jStrings = index.map(function(indexs){
        //                let cardModel = this._kqCardModes[indexs];
        //                return cardModel.cardName();
        //            }.bind(this));
        //
        //
        //            for(var r = 0;r < index.length;r++){
        //                jString = jString + iStrings[r];
        //                iString = iString + jStrings[r];
        //            }
        //
        //            if(jString == iString){
        //                findedIndexsArray.splice(i,1);
        //                break;
        //            }
        //        }
        //    }
        //
        //    this._findCardTypeObject = {
        //        title: title,
        //        indexsArray: findedIndexsArray,
        //        //index: title=="duiZi"?findedIndexsArray.length-1:0
        //        index: 0
        //    };
        //}
        //
        //findedIndexsArray = this._findCardTypeObject.indexsArray;
        //if (!findedIndexsArray || findedIndexsArray.length == 0) {
        //    return;
        //}
        //// 将已有的突出的牌的位置重置回初始位置
        //this._resetCardsPositionY();
        //
        //// 计算出要突出的牌数组
        //var index = this._findCardTypeObject.index;
        //let indexs = findedIndexsArray[index];
        //
        //let selectedCardNames = indexs.map(function(index){
        //    let cardModel = this._kqCardModes[index];
        //    return cardModel.cardName();
        //}.bind(this));
        //
        //let cardNodes = this.cardsLayout.node.children.filter(function (cardNode) {
        //    let cardPrefab = cardNode.getComponent('CardPrefab');
        //    if(selectedCardNames.includes(cardPrefab.cardName())) {
        //        var nameIndex = selectedCardNames.indexOf(cardPrefab.cardName());
        //        selectedCardNames.splice(nameIndex,1);
        //        return true;
        //    }
        //    return false;
        //});

        //// 突出计算出来的牌数组
        //this._changeCardPrefabsY(cardNodes);
        //// 保存好，用于再次点击了突出下一组牌
        //index = (index + 1) % findedIndexsArray.length;
        //this._findCardTypeObject.index = index;
    },

    clickDuiZi: function clickDuiZi() {
        this._stickOutFindCardType("duiZi", function () {
            return KQCard.findDuiZi(this._kqCardModes);
        }.bind(this));
    },

    clickLiangDui: function clickLiangDui() {
        this._stickOutFindCardType("liangDui", function () {
            return KQCard.findLiaDui(this._kqCardModes);
        }.bind(this));
    },

    clickSanTiao: function clickSanTiao() {
        this._stickOutFindCardType("sanTiao", function () {
            return KQCard.findSanTiao(this._kqCardModes);
        }.bind(this));
    },

    clickShunZi: function clickShunZi() {
        this._stickOutFindCardType("shunZi", function () {
            return KQCard.findShunZi(this._kqCardModes);
        }.bind(this));
    },

    clickTongHua: function clickTongHua() {
        this._stickOutFindCardType("tongHua", function () {
            return KQCard.findTongHua(this._kqCardModes);
        }.bind(this));
    },

    clickHuLu: function clickHuLu() {
        this._stickOutFindCardType("huLu", function () {
            return KQCard.findHuLu(this._kqCardModes);
        }.bind(this));
    },

    clickTieZhi: function clickTieZhi() {
        this._stickOutFindCardType("tieZhi", function () {
            return KQCard.findTieZhi(this._kqCardModes);
        }.bind(this));
    },

    /*#####*/
    clickWuTong: function clickWuTong() {
        this._stickOutFindCardType("wuTong", function () {
            return KQCard.findWuTong(this._kqCardModes);
        }.bind(this));
    },
    /*#####*/

    clickTongHuaShun: function clickTongHuaShun() {
        this._stickOutFindCardType("tongHuaShun", function () {
            return KQCard.findTongHuaShun(this._kqCardModes);
        }.bind(this));
    },

    clickCancelAll: function clickCancelAll() {
        this.clickDeleteTouDao();
        this.clickDeleteZhongDao();
        this.clickDeleteWeiDao();
    },

    /*点击完成按钮*/
    clickDone: function clickDone() {
        cc.sys.localStorage.removeItem("timestamp");
        this.cardAlls = this.cardAllNode.children.sort(function (a, b) {
            return b.y - a.y;
        }).map(function (i) {
            return i.children[0];
        });

        var touCardModels = this._taoDaoCardModes();
        var zhongCardModes = this._zhongDaoCardModes();
        var weiCardModes = this._weiDaoCardModes();
        this._didSelectedCards(touCardModels, zhongCardModes, weiCardModes);
    },

    /*点击恭喜你页面的确定按钮*/
    onBtnGongXiNiComfirmClick: function onBtnGongXiNiComfirmClick() {
        //记录玩家点击了确定按钮：
        this.BtnClickGongXiNiComfirm = true;

        var cards = [];

        cc.teShuPaiCards.forEach(function (i) {
            cards = cards.concat(i);
        });

        var teShuPaiCardsServerInfo = this._convertCardsToServerModel2(cards);
        var result = [teShuPaiCardsServerInfo];
        if (this._finishSelectCardsCallback) {
            this._finishSelectCardsCallback(result);
        }
    },

    _didSelectedCards: function _didSelectedCards(touCards, zhongCards, weiCards) {
        touCards = touCards || [];
        zhongCards = zhongCards || [];
        weiCards = weiCards || [];
        var touServerInfo = this._convertCardsToServerModel(touCards);
        var zhongServerInfo = this._convertCardsToServerModel(zhongCards);
        var weiServerInfo = this._convertCardsToServerModel(weiCards);

        //console.log(touServerInfo);
        //console.log(zhongServerInfo);
        //console.log(weiServerInfo);
        //console.log("---------------------------------512");
        if (!(touServerInfo.value < zhongServerInfo.value && zhongServerInfo.value <= weiServerInfo.value)) {
            this.autoCardAnimation.y = -50;
            this.autoCardAnimation.opacity = 255;
            this.autoCardAnimation.runAction(cc.moveTo(1, cc.p(0, 0)));
            this.scheduleOnce(function () {
                var action = cc.spawn(cc.moveTo(this.cardTime, cc.p(0, 10)), cc.fadeOut(this.cardTime));
                this.autoCardAnimation.runAction(action);
            }.bind(this), 1.5);
            return;
        }
        var result = [touServerInfo, zhongServerInfo, weiServerInfo];
        //return;
        if (this._finishSelectCardsCallback) {
            this._finishSelectCardsCallback(result);
        }
    },

    clickDeleteTouDao: function clickDeleteTouDao() {
        this._deleteDaoCardsOfLayout(this.layoutTouDao.node);
    },

    clickDeleteZhongDao: function clickDeleteZhongDao() {
        this._deleteDaoCardsOfLayout(this.layoutZhongDao.node);
    },

    clickDeleteWeiDao: function clickDeleteWeiDao() {
        this._deleteDaoCardsOfLayout(this.layoutWeiDao.node);
    },

    // 计时器事件
    timeStart: function timeStart(duration) {
        cc.assert(duration > 0);
        this.timeStop();
        this.timeNode.active = true;
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
        this._timeRemainDuration = duration;
        this.labelTime.string = String(duration);
        this.timeNode.getComponent("time").setTime(duration * 0.5);
        this.schedule(this._timeMethod, 1, duration);
    },

    timeStop: function timeStop() {
        this.unschedule(this._timeMethod);
        this.timeNode.active = false;
    },

    _timeMethod: function _timeMethod() {
        this._timeRemainDuration = this._timeRemainDuration - 1;

        var remain = Math.max(this._timeRemainDuration, 0);
        this.labelTime.string = remain < 10 && remain > 0 ? '0' + remain : remain;

        if (this._timeRemainDuration <= 0) {
            this.timeStop();
            if (cc.chaoShiChuPai == true) this._timeOutAutoSelectCards();
            cc.sys.localStorage.removeItem("timestamp");
            return;
        }
    },

    // 超时后，自动选牌
    _timeOutAutoSelectCards: function _timeOutAutoSelectCards() {
        /**
         * 隐藏恭喜你
         */
        play.gongXiNiShow(false);
        if (typeof cc.teShuPaiCards != "undefined" && cc.teShuPaiCards != null) {
            this.onBtnGongXiNiComfirmClick();
            return;
        }

        //let [touCardModels, zhongCardModes, weiCardModes] = this._cacleAutoSelectedCards();

        var _findCardIndex$arr$ = _slicedToArray(this._findCardIndex.arr[0], 3),
            touCardModels = _findCardIndex$arr$[0],
            zhongCardModes = _findCardIndex$arr$[1],
            weiCardModes = _findCardIndex$arr$[2];

        if (touCardModels == null || zhongCardModes == null || weiCardModes == null) {
            touCardModels = this._allCardModes.slice(-3);
            zhongCardModes = this._allCardModes.slice(5, 10);
            weiCardModes = this._allCardModes.slice(0, 5);
        }

        // cc.log(touCardModels)
        // cc.log(zhongCardModes)
        // cc.log(weiCardModes)
        // cc.log(this._allCardModes)
        // cc.log("自动选牌 touCardModels zhongCardModes weiCardModes：");
        this._didSelectedCards(touCardModels, zhongCardModes, weiCardModes);
    },

    _cacleAutoSelectedCards: function _cacleAutoSelectedCards() {
        var cards = this._allCardModes.filter(function (i) {
            return i;
        });
        var resultCards = [];
        for (var i = 1; i < 3; i++) {
            var cardss = KQCard.autoSelectCards(cards, 5);
            cards = cards.kq_excludes(cardss);
            resultCards.push(cardss);
        }
        resultCards.push(cards);
        //let touScore = KQCard.scoreOfCards(resultCards[2]);
        //let zhongScore = KQCard.scoreOfCards(resultCards[1]);
        //let weiScore = KQCard.scoreOfCards(resultCards[0]);
        // cc.log(resultCards)
        // cc.log(this._allCardModes)
        // cc.log("牌分数自动选牌：", touScore, zhongScore, weiScore);
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

    _convertCardsToServerModel: function _convertCardsToServerModel(cards) {
        var result = {};
        result.type = KQCard.cardsType(cards);
        result.value = KQCard.scoreOfCards(cards);
        cards = KQCard._typeCardsSortByNumberOfPoints1(cards);
        result.cards = KQCard.convertToServerCards(cards);

        return result;
    },

    /*#####*/
    _convertCardsToServerModel2: function _convertCardsToServerModel2(cards) {
        var convertToServerCards = [];

        cc.teShuPaiCards.forEach(function (cardMode) {
            var arr = [];
            cardMode = KQCard._typeCardsSortByNumberOfPoints(KQCard.cardsFromArray(cardMode));
            cardMode.forEach(function (cca) {
                var point = cca.point == 14 ? 1 : cca.point;
                arr.push({ number: point, suit: cca.color });
            });
            convertToServerCards.push(arr);
        });
        var result = {};
        result.type = KQCard.cardsType(cards);
        result.value = 0;
        result.cards = convertToServerCards;

        if (result.type >= KQCard.TYPE.SanTaoHua && cc.moshi != 1) {
            // 特殊牌
            result.isContainExtra = true;
        }

        return result;
    },
    /*#####*/
    // 特殊牌里是否还含有特殊牌
    // 包含的情况有：
    // 三桃花 可能含有同花顺
    // 三顺子 可能含有同花顺
    // 六对半 可能含有铁支
    _isContainExtraCardsType: function _isContainExtraCardsType(type, cards) {
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
    _registerTouchEvents: function _registerTouchEvents() {
        //this.cardsLayout.node.on(cc.Node.EventType.TOUCH_START, this._touchCardLayout.bind(this));
        //this.cardsLayout.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchCardLayout.bind(this));
        //this.cardsLayout.node.on(cc.Node.EventType.TOUCH_END, this._touchCardLayoutEnd.bind(this));
        //this.cardsLayout.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCardLayoutEnd.bind(this));
    },
    cacleAutoSelectedCardsIndex: function cacleAutoSelectedCardsIndex(cards) {
        //cc.log('------622')
        var testFind = KQCard.testFind(cards) || [];
        //cc.log('------6221')
        var result = [];
        for (var i = 0; i < testFind.length; i++) {
            var s = testFind[i];
            if (s.length >= 1) {
                for (var j = 0; j < s.length; j++) {
                    //result.push(s[0]);//只取一个
                    result.push(s[j]); //
                }
            }
        }
        return result;
    },

    cacleAutoSelectedCardsArray: function cacleAutoSelectedCardsArray(cards) {
        var indexs = this.cacleAutoSelectedCardsIndex(cards);
        if (indexs.length < 1) {
            return false;
        }
        var selectedCard = [];
        for (var i = 0; i < indexs.length; i++) {
            var s = indexs[i];
            var a = s.map(function (index) {
                return cards[index];
            });
            selectedCard.push(a);
        }
        return selectedCard;
    },

    cacleAutoSelectedCards2: function cacleAutoSelectedCards2() {
        var cards = this._allCardModes.slice();
        var cardsArray = this.cacleAutoSelectedCardsArray(cards);
        var resultArray = [];
        for (var i = 0; i < cardsArray.length; i++) {
            var _s = cardsArray[i] || [];
            var qwer = [];
            for (var j = 1; j < cardsArray.length; j++) {
                var d = cardsArray[j] || [];
                var sC = _s.kq_excludes(d);
                if (sC.length == _s.length && _s.length > 0) {
                    //判断牌相同 即没有重复的
                    qwer = [_s, d];
                }
            }
            if (qwer.length > 1) {
                resultArray.push(qwer);
            }
        }

        //补全计划1
        for (var i = 0; i < resultArray.length; i++) {

            var _s2 = resultArray[i];

            var cardss = this._allCardModes.slice();

            cardss = cardss.kq_excludes(_s2[0]);

            cardss = cardss.kq_excludes(_s2[1]);

            if (cardss.length >= 5) {
                _s2[2] = KQCard.autoSelectCards(cardss, 5);
            } else {
                _s2[2] = KQCard.autoSelectCards(cardss, 3);
            }

            resultArray[i].sort(function (a1, a2) {
                return KQCard.scoreOfCards(a1) - KQCard.scoreOfCards(a2);
            });
        }
        //补全计划2
        for (var i = 0; i < resultArray.length; i++) {
            var s = resultArray[i];
            var cardsqe = this._allCardModes.filter(function (ii) {
                //重新赋值cards
                return ii;
            });
            //去重
            var q = s[0].concat(s[1]).concat(s[2]);
            var cardsq = cardsqe.kq_excludes(q);
            s[0] = s[0].kq_excludes(s[1]);
            s[0] = s[0].kq_excludes(s[2]);
            s[1] = s[1].kq_excludes(s[0]);
            s[1] = s[1].kq_excludes(s[2]);
            s[2] = s[2].kq_excludes(s[1]);
            s[2] = s[2].kq_excludes(s[0]);
            //多余删除
            if (s[2].length > 5) {
                //尾道
                var a = s[2].splice(5, s[2].length - 5);
                for (var y in a) {
                    cardsq.push(a[y]);
                }
            }
            if (s[1].length > 5) {
                //中道
                var _a = s[1].splice(5, s[1].length - 5);
                for (var y in _a) {
                    cardsq.push(_a[y]);
                }
            }
            if (s[0].length > 3) {
                //头道
                var _a2 = s[0].splice(3, s[0].length - 3);
                for (var y in _a2) {
                    cardsq.push(_a2[y]);
                }
            }
            //cardsq = KQCard._convertOneToA(cardsq);
            cardsq.sort(KQCard.sortByPoint);
            cardsq.forEach(function (card11) {
                if (card11.point == 14) {
                    card11.point = 1;
                }
            });
            //有缺添加
            while (s[2].length < 5) {
                //尾道
                s[2].push(cardsq.pop() || []);
            }
            while (s[1].length < 5) {
                //中道
                s[1].push(cardsq.pop() || []);
            }
            while (s[0].length < 3) {
                //头道
                s[0].push(cardsq.pop() || []);
            }
            /*if(cardsq.length > 0){
                while(s[2].length < 5) {//尾道
                    s[2].push(cardsq.pop());
                }
            }
            if(cardsq.length > 0){
                while(s[1].length < 5) {//中道
                    s[1].push(cardsq.pop());
                }
            }
            if(cardsq.length > 0){
                while(s[0].length < 3) {//头道
                    s[0].push(cardsq.pop());
                }
            }*/
            if (s[2][4] == null || s[1][4] == null || s[0][2] == null || s[2][4] == '' || s[1][4] == '' || s[0][2] == '') {
                resultArray.splice(i, 1);
            }
        }

        var resultCards = [];
        var cardss1 = this._allCardModes.filter(function (i) {
            return i;
        });
        var indexasdf = 2;
        for (var i = 0; i < 3; i++) {
            var length = indexasdf == 0 ? 3 : 5;
            var _cardss = KQCard.autoSelectCards(cardss1, length) || [];
            cardss1 = cardss1.kq_excludes(_cardss);
            resultCards[indexasdf] = _cardss;
            indexasdf--;
        }

        for (var i = 0; i < resultCards.length; i++) {
            var _length = i == 0 ? 3 : 5;
            if (resultCards[i].length < _length) {
                cardss1 = cardss1.kq_excludes(resultCards[i]);
                while (resultCards[i].length < _length) {
                    resultCards[i].push(cardss1.pop());
                }
            }
        }

        resultArray.push(resultCards);

        var cardsTypeNames = [];
        var resultArrays = [];

        for (var i = 0; i < resultArray.length; i++) {
            //删除类型相同的组合
            var _s3 = resultArray[i];
            var typeName0 = KQCard.cardsTypeName(_s3[0]);
            typeName0 += KQCard.cardsTypeName(_s3[1]);
            typeName0 += KQCard.cardsTypeName(_s3[2]);
            if (cardsTypeNames.indexOf(typeName0) == -1) {
                var touScore = KQCard.scoreOfCards(_s3[0]);
                var zhongScore = KQCard.scoreOfCards(_s3[1]);
                var weiScore = KQCard.scoreOfCards(_s3[2]);
                if (zhongScore > touScore && zhongScore < weiScore) {
                    cardsTypeNames.push(typeName0);
                    resultArrays.push(_s3);
                }
            }
        }

        resultArrays.sort(function (a1, a2) {
            var b0 = parseInt(KQCard.cardsType(a2[0])) + "";
            var b1 = parseInt(KQCard.cardsType(a2[1])) + "";
            var b2 = parseInt(KQCard.cardsType(a2[2])) + "";

            var s0 = parseInt(KQCard.cardsType(a1[0])) + "";
            var s1 = parseInt(KQCard.cardsType(a1[1])) + "";
            var s2 = parseInt(KQCard.cardsType(a1[2])) + "";

            var s = parseInt(s2 + s1 + s0);
            var b = parseInt(b2 + b1 + b0);

            return b - s;
        });

        if (resultArrays.length > 7) {
            resultArrays = resultArrays.slice(0, 7);
        }
        //for(var i = 0;i < resultArrays.length;i++){//如果有相公牌则删除
        //    let s = resultArrays[i];
        //    let touScore = KQCard.scoreOfCards(s[0]);
        //    let zhongScore = KQCard.scoreOfCards(s[1]);
        //    let weiScore = KQCard.scoreOfCards(s[2]);
        //    cc.log(touScore,zhongScore,weiScore);
        //    if(weiScore < touScore || weiScore < zhongScore){
        //        resultArrays.splice(i,1);
        //    }
        //}
        //cc.log(resultArrays)
        //cc.log('-------897')

        //if(cc.teShuPaiCards){
        //    var TeShuCards = cc.teShuPaiCards.map(function(ca){
        //       return KQCard._typeCardsSortByNumberOfPoints(KQCard.cardsFromArray(ca));
        //    });
        //    resultArrays.unshift(TeShuCards);
        //
        //}

        if (resultArrays.length <= 0) {

            this._allCardModes.forEach(function (i) {
                if (i.scores == 1) i.scores = 14;
            });

            var card20 = KQCard.contain20(this._allCardModes);

            this._allCardModes = this._allCardModes.kq_excludes(card20);

            this._allCardModes = KQCard._typeCardsSortByNumberOfPoints(this._allCardModes);

            this._allCardModes = card20.concat(this._allCardModes);

            var asdf1 = this._allCardModes.slice(0, 5);

            var asdf2 = this._allCardModes.slice(5, 10);

            var asdf3 = this._allCardModes.slice(10, 13);

            resultArrays.push([asdf3, asdf2, asdf1]);
        }

        this.autoCardLayout.node.removeAllChildren();
        this.autoCardScrollView.scrollToLeft();
        for (var i = 0; i < resultArrays.length; i++) {
            //添加预制体
            var _s4 = resultArrays[i];
            var autoCard = cc.instantiate(this.autoCard);
            autoCard.y = 0;
            _s4[0].forEach(function (i) {
                if (i.point == 14) i.point = 1;
            });
            _s4[1].forEach(function (i) {
                if (i.point == 14) i.point = 1;
            });
            _s4[2].forEach(function (i) {
                if (i.point == 14) i.point = 1;
            });
            var cardsNode = [autoCard.children[1], autoCard.children[3], autoCard.children[2]];

            this._setCardDaoSprite(cardsNode, _s4);

            autoCard.cardArray = _s4;
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "CardTypeCombine";
            eventHandler.handler = "clickAutoSelectedCards";
            eventHandler.customEventData = i;
            autoCard.getComponent(cc.Button).clickEvents.push(eventHandler);
            this.autoCardLayout.node.addChild(autoCard);
        }
        this._findCardIndex.arr = resultArrays;

        this.autoSelectedCardsOne();
    },

    //daoCancelAll: function () {
    //    var nodes = [this.layoutTouDao.node,this.layoutZhongDao.node,this.layoutWeiDao.node];
    //    for(var i = 0;i < nodes.length;i++){
    //        nodes[i].removeAllChildren();
    //    }
    //},

    autoSelectedCardsOne: function autoSelectedCardsOne() {
        this.cardsLayout.node.removeAllChildren();

        var indexs = 0;

        for (var i = 0; i < this.autoCardLayout.node.children.length; i++) {

            var nodes = this.autoCardLayout.node.children[i];

            nodes.children[0].active = false;
        }

        this.autoCardLayout.node.children[indexs].children[0].active = true;

        var resultArray = this._findCardIndex.arr[indexs];

        this._findCardIndex.indexs = indexs;

        for (var i = 0; i < resultArray.length; i++) {

            var cardModes = resultArray[i];

            cardModes.sort(KQCard.sort);

            var num = 0;
            if (i == 1) {
                num = 3;
            } else if (i == 2) {
                num = 8;
            }
            //cardModes.forEach(function(i){if (i.point == 14) i.point = 1;})
            cardModes.forEach(function (cardMode, index) {

                var cardName = cardMode.cardName();

                var numBer = num + index;

                var nodds1 = new cc.Node(); //创建一个节点对象

                nodds1.anchorY = 1;

                nodds1.addComponent(cc.Sprite); //添加精灵组件

                this.cardAllNode.children[numBer].addChild(nodds1);

                this.cardAllNode.children[numBer].children[0].cardName = cardName;

                this.cardAllNode.children[numBer].children[0]._cardModel = new KQCard(cardName, null, index);

                var btnSprites = this.cardAllNode.children[numBer].children[0].getComponent(cc.Sprite);

                this.cardAllNode.children[numBer].getComponent(cc.Sprite).spriteFrame = '';

                btnSprites.node.removeAllChildren();

                if (cc.maPai == cardName) {

                    var nodds = new cc.Node(); //创建一个节点对象

                    nodds.addComponent(cc.Sprite); //添加精灵组件

                    cc.loader.loadRes('play/desk/img_red5_1', cc.SpriteFrame, function (err, spriteFrame) {

                        if (err) {
                            cc.error(err.message || err);return;
                        }

                        var btnSprite1 = nodds.getComponent(cc.Sprite);

                        btnSprite1.spriteFrame = spriteFrame;

                        btnSprite1.node.width = 107;

                        btnSprite1.node.height = 155;

                        btnSprite1.node.y = -65.5;
                    }.bind(this));

                    btnSprites.node.addChild(nodds);
                }

                var path = 'public-pic-card-poker-' + cardName;

                this._loadCardFrame(this.cardSpriteAtlas, path, btnSprites, 95, 130);
            }.bind(this));
        }

        this.clickAutoSelectedCards(null);

        //this._setCardDaoSprite();
    },

    clickAutoSelectedCards: function clickAutoSelectedCards(event) {
        var indexs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


        for (var i = 0; i < this.autoCardLayout.node.children.length; i++) {

            var nodes = this.autoCardLayout.node.children[i];

            nodes.children[0].active = false;
        }

        this.autoCardLayout.node.children[indexs].children[0].active = true;

        AudioManager.instance.playPokerClick();

        if (event) {
            var resultArray = event.target.cardArray;
        } else {
            var resultArray = this._findCardIndex.arr[indexs];
        }
        var touScore = KQCard.scoreOfCards(resultArray[0]);
        var zhongScore = KQCard.scoreOfCards(resultArray[1]);
        var weiScore = KQCard.scoreOfCards(resultArray[2]);
        //cc.log(touScore);
        //cc.log(zhongScore);
        //cc.log(weiScore);
        //console.log('----------1180')
        resultArray = resultArray.map(function (cardMode) {

            cardMode = KQCard._typeCardsSortByNumberOfPoints(cardMode);

            return cardMode.map(function (cardModes) {

                return cardModes.cardName();
            }.bind(this));
        }.bind(this));
        //console.log(resultArray)

        this.LayoutWithEvent.forEach(function (nodes) {

            nodes.color = new cc.Color(255, 255, 255);

            nodes.children.forEach(function (i) {
                i.color = new cc.Color(255, 255, 255);
            });
        });

        this.LayoutWithEvent = [];

        resultArray = resultArray[0].concat(resultArray[1]).concat(resultArray[2]);

        var cardAllNode = this.cardAllNode.children.map(function (i) {
            return i;
        });

        for (var i = 0; i < resultArray.length; i++) {

            var s = resultArray[i];

            for (var j = 0; j < cardAllNode.length; j++) {

                var d = cardAllNode[j];

                d.getComponent(cc.Button).interactable = false;

                if (d.children[0].cardName == s) {

                    d.stopAllActions();

                    var detail = this.changeNodeSpaceAR[i];

                    var call = cc.callFunc(function () {

                        this.cardAllNode.children.forEach(function (nodes) {
                            nodes.getComponent(cc.Button).interactable = true;
                        });

                        this._setCardDaoSprite();
                    }.bind(this), this);

                    d.runAction(cc.sequence(cc.moveTo(this.cardTime, detail), call));

                    cardAllNode.splice(j, 1);

                    break;
                }
            }
        }
    },

    _loadCardFrame: function _loadCardFrame(SpriteFrame, path, SpritesNode, w, h) {

        var Sprite = SpriteFrame.getSpriteFrame(path);

        SpritesNode.spriteFrame = Sprite;

        if (w) SpritesNode.node.width = w;

        if (h) SpritesNode.node.height = h;
    },

    stickOutFindCardType1: function stickOutFindCardType1(cards) {
        //// 将已有的突出的牌的位置重置回初始位置
        //this._resetCardsPositionY();
        //let selectedCardNames = cards.map(function(cardModel){
        //    return cardModel.cardName();
        //}.bind(this));
        //
        //let cardNodes = this.cardsLayout.node.children.filter(function (cardNode) {
        //    let cardPrefab = cardNode.getComponent('CardPrefab');
        //    if(selectedCardNames.includes(cardPrefab.cardName())) {
        //        var nameIndex = selectedCardNames.indexOf(cardPrefab.cardName());
        //        selectedCardNames.splice(nameIndex,1);
        //        return true;
        //    }
        //    return false;
        //});
        //
        //cc.log('-------696')
        //this._changeCardPrefabsY(cardNodes);
        //if(index == 1){
        //    this._addDaoCardToLayout(this.layoutTouDao.node, 3);
        //}
        //else if(index == 2){
        //    this._addDaoCardToLayout(this.layoutZhongDao.node);
        //}
        //else if(index == 3){
        //    this._addDaoCardToLayout(this.layoutWeiDao.node);
        //}

        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    },

    _touchCardLayout: function _touchCardLayout(event) {
        //event.bubbles = true;
        //let location = event.getLocation();
        //let cardPrefab = this._cardPrefabInCardLayoutWithLocation(location);
        //if (cardPrefab) {
        //    cardPrefab.getComponent('CardPrefab').setSelected(true);
        //    event.stopPropagation();
        //}
    },

    _touchCardLayoutEnd: function _touchCardLayoutEnd(event) {
        //this._changeSelectedCardPrefabsY();
        //this._diseclectCardPrefabs();
    },

    _cardPrefabInCardLayoutWithLocation: function _cardPrefabInCardLayoutWithLocation(location) {
        //location = this.cardsLayout.node.convertToNodeSpaceAR(location);
        //let cardNodes = this.cardsLayout.node.children.sort(function (cardNode1, cardNode2) {
        //    let rect1 = cardNode1.getBoundingBox();
        //    let rect2 = cardNode2.getBoundingBox();
        //    return rect2.x - rect1.x;
        //});
        //for (let index in cardNodes) {
        //    let cardNode = cardNodes[index];
        //
        //    let rect = cardNode.getBoundingBox();
        //
        //    if (cc.rectContainsPoint(rect, location)) {
        //        return cardNode;
        //    }
        //}
        //
        //return null;
    },

    _changeSelectedCardPrefabsY: function _changeSelectedCardPrefabsY() {
        //let cardNodes = this._selectedCardPrefabs();
        //this._changeCardPrefabsY(cardNodes);
        //
        //AudioManager.instance.playPokerClick();
    },

    _changeCardPrefabsY: function _changeCardPrefabsY(cardNodes) {
        //cardNodes.forEach(function (cardNode) {
        //    let y = cardNode.getPositionY();
        //    if (y == this._cardOffsetY) {
        //        cardNode.setPositionY(this._cardOffsetY + 55);
        //    } else {
        //        cardNode.setPositionY(this._cardOffsetY);
        //    }
        //}.bind(this));
    },

    _selectedCardPrefabs: function _selectedCardPrefabs() {
        //let cardNodes = this.cardsLayout.node.children || [];
        //return cardNodes.filter(function (cardNode) {
        //    let cardPrefab = cardNode.getComponent('CardPrefab');
        //    let isSelected = cardPrefab.isSelected();
        //    if (!isSelected && includeStickOut) {
        //        isSelected = cardNode.getPositionY() > 10;
        //    }
        //
        //    return isSelected;
        //});

        var includeStickOut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    },

    _diseclectCardPrefabs: function _diseclectCardPrefabs() {
        //let cardNodes = this.cardsLayout.node.children;
        //cardNodes.forEach(function (node) {
        //    node.getComponent('CardPrefab').setSelected(false);
        //});
    },

    // 重置 cards 的 X
    _resetCardsPositionX: function _resetCardsPositionX() {
        //let interval = 98;
        //let interval = 78;
        //let cardNodes = this.cardsLayout.node.children || [];
        //let length = cardNodes.length;
        //if (length == 0) {
        //    return;
        //}
        //
        //let middleIndex = length / 2;
        //let cardWidth = 154;
        //
        //
        ////this.cardsLayoutSort();
        //if(this.cardsLayoutSortColor == true){
        //    this.cardsLayout.node.children.sort(function (n1, n2) {
        //        let component1 = n1.getComponent('CardPrefab');
        //        let component2 = n2.getComponent('CardPrefab');
        //        return component2.cardMode().color - component1.cardMode().color;
        //    });
        //}else{
        //    this.cardsLayout.node.children.sort(function (n1, n2) {
        //        let component1 = n1.getComponent('CardPrefab');
        //        let component2 = n2.getComponent('CardPrefab');
        //        return component1.cardMode().sort(component2.cardMode());
        //    });
        //}
        ////cardNodes.sort(function (n1, n2) {
        ////    let component1 = n1.getComponent('CardPrefab');
        ////    let component2 = n2.getComponent('CardPrefab');
        ////
        ////    return component1.cardMode().sort(component2.cardMode());
        ////});
        //
        //cardNodes.forEach(function (cardNode, index) {
        //    cardNode.zIndex = index;
        //    let x = (index - middleIndex) * interval + cardWidth / 3;
        //    cardNode.setPositionX(x);
        //});
    },

    // 重置 cards 的 X为0
    resetCardsPositionX1: function resetCardsPositionX1() {
        //let cardNodes = this.cardsLayout.node.children || [];
        //let length = cardNodes.length;
        //if (length == 0) {
        //    return;
        //}
        //cardNodes.forEach(function (cardNode) {
        //    cardNode.setPositionY(0);
        //});
    },

    _resetCardsPositionY: function _resetCardsPositionY() {
        //let cardNodes = this.cardsLayout.node.children || [];
        //cardNodes.forEach(function (cardNode) {
        //    cardNode.setPositionY(this._cardOffsetY);
        //}.bind(this));
    },

    // 头、中、尾道 layout 的点击事件
    _registerDaosLayoutClickEvent: function _registerDaosLayoutClickEvent() {

        this.changeNodeSpaceAR = []; //记录所有牌的坐标
        this.cardAllNode.children.forEach(function (nodes) {
            //获取节点的世界坐标
            var cardBackWorldSpace1 = nodes.convertToWorldSpaceAR(cc.v2(0, 0));
            //获取相对父节点所在的坐标
            var detail = nodes.parent.convertToNodeSpaceAR(cardBackWorldSpace1);

            this.changeNodeSpaceAR.push(detail);
        }.bind(this));
    },

    clickAllCard: function clickAllCard(event) {
        AudioManager.instance.playPokerClick();
        if (this.LayoutWithEvent.length <= 1) {
            this.LayoutWithEvent.push(event.target);
            event.target.color = new cc.Color(182, 182, 182);
            event.target.children.forEach(function (i) {
                i.color = new cc.Color(182, 182, 182);
            });
        }
        if (this.LayoutWithEvent.length == 2) {

            var arr = [];

            this.LayoutWithEvent.forEach(function (nodes) {
                //获取节点的世界坐标
                var cardBackWorldSpace1 = nodes.convertToWorldSpaceAR(cc.v2(0, 0));
                //获取相对父节点所在的坐标
                var detail = nodes.parent.convertToNodeSpaceAR(cardBackWorldSpace1);

                arr.unshift(detail);
            }.bind(this));

            this.LayoutWithEvent.forEach(function (nodes, index) {

                nodes.color = new cc.Color(255, 255, 255);

                nodes.children.forEach(function (i) {
                    i.color = new cc.Color(255, 255, 255);
                });

                nodes.getComponent(cc.Button).interactable = false;

                this.scheduleOnce(function () {

                    nodes.getComponent(cc.Button).interactable = true;

                    this._setCardDaoSprite();
                }.bind(this), this.cardTime);

                nodes.stopAllActions();

                var detail = arr[index];

                nodes.runAction(cc.moveTo(this.cardTime, detail));
            }.bind(this));

            this.LayoutWithEvent = [];
        }
    },

    _setCardDaoSprite: function _setCardDaoSprite() {
        var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var cards = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


        if (!nodes) {

            this.cardAlls = this.cardAllNode.children.sort(function (a, b) {
                return b.y - a.y;
            }).map(function (i) {
                return i.children[0];
            });

            cards = [this._taoDaoCardModes(), this._zhongDaoCardModes(), this._weiDaoCardModes()];

            cards.forEach(function (card) {
                card.forEach(function (i) {
                    if (i.scores == 14) {
                        i.scores = 1;
                    }
                });
            });

            nodes = [this.touDaoNode, this.zhongDaoNode, this.weiDaoNode];
        }

        //头道
        var typeName0 = KQCard.cardsType(cards[0]) + 1;

        typeName0 = typeName0 >= 10 ? typeName0 : "0" + typeName0;

        typeName0 = typeName0 == '04' ? '11' : typeName0;

        var path = 'game_poker_type' + typeName0;

        this._loadCardFrame(this.daoSpriteAtlas, path, nodes[0].getComponent(cc.Sprite));

        //中道
        var typeName1 = KQCard.cardsType(cards[1]) + 1;

        typeName1 = typeName1 >= 10 ? typeName1 : "0" + typeName1;

        typeName1 = typeName1 == '07' ? '22' : typeName1;

        path = 'game_poker_type' + typeName1;

        this._loadCardFrame(this.daoSpriteAtlas, path, nodes[1].getComponent(cc.Sprite));

        //尾道
        var typeName2 = KQCard.cardsType(cards[2]) + 1;

        typeName2 = typeName2 >= 10 ? typeName2 : "0" + typeName2;

        path = 'game_poker_type' + typeName2;

        this._loadCardFrame(this.daoSpriteAtlas, path, nodes[2].getComponent(cc.Sprite));

        this.cardAllNode.children.forEach(function (n) {
            n.getComponent(cc.Sprite).spriteFrame = "";
        });

        if (cards) {

            if (typeName0) KQCard._setGuiCard(0, 0, 3, typeName0, cards, this.cardAllNode.children, this.cardSpriteAtlas);

            if (typeName1) KQCard._setGuiCard(1, 3, 8, typeName1, cards, this.cardAllNode.children, this.cardSpriteAtlas);

            if (typeName2) KQCard._setGuiCard(2, 8, 13, typeName2, cards, this.cardAllNode.children, this.cardSpriteAtlas);
        }
    },

    _clickTouDaoLayout: function _clickTouDaoLayout(event) {
        this._daoCardNodeInLayoutWithEvent(this.layoutTouDao.node, event);
    },

    _clickZhongDaoLayout: function _clickZhongDaoLayout(event) {
        this._daoCardNodeInLayoutWithEvent(this.layoutZhongDao.node, event);
    },

    _clickWeiDaoLayout: function _clickWeiDaoLayout(event) {
        this._daoCardNodeInLayoutWithEvent(this.layoutWeiDao.node, event);
    },

    _daoCardNodeInLayoutWithEvent: function _daoCardNodeInLayoutWithEvent(node, event) {
        var cardNodes = node.children || [];
        var location = event.getLocation();
        location = node.convertToNodeSpaceAR(location);
        //var cardBackWorldSpace = this.layoutZhongDao.node.convertToWorldSpaceAR(cc.v2(0, 0));
        ////获取节点的世界坐标
        //var detail = this.layoutZhongDao.node.parent.convertToNodeSpaceAR(cardBackWorldSpace);
        ////获取相对父节点所在的坐标
        //this.layoutWeiDao.node.runAction(cc.moveTo(1,detail));
        for (var index in cardNodes) {
            var cardNode = cardNodes[index];
            var rect = cardNode.getBoundingBox();
            if (cc.rectContainsPoint(rect, location)) {
                AudioManager.instance.playPokerClick();
                var arrs = [node, cardNode];
                if (this.LayoutWithEvent.length == 1) {
                    if (this.LayoutWithEvent[0][0].name != node.name) {
                        cardNode.opacity = 200;
                        this.LayoutWithEvent.push(arrs);
                    } else {
                        this.LayoutWithEvent[0][1].opacity = 255;
                        this.LayoutWithEvent = [];
                    }
                } else if (this.LayoutWithEvent.length == 0) {
                    //cc.log(cardNode)
                    this.LayoutWithEvent.push(arrs);
                    cardNode.opacity = 200;
                }
                if (this.LayoutWithEvent.length == 2) {
                    var node1 = this.LayoutWithEvent[0][1];
                    var node2 = this.LayoutWithEvent[1][1];
                    //获取节点的世界坐标
                    var cardBackWorldSpace = node1.convertToWorldSpaceAR(cc.v2(0, 0));
                    //获取相对父节点所在的坐标
                    var detail = node1.parent.convertToNodeSpaceAR(cardBackWorldSpace);
                    node2.runAction(cc.moveTo(1, detail));
                }

                return;
            }
        }

        //return null;
    },

    _addDaoCardToLayout: function _addDaoCardToLayout(node) {
        //let cardNodes = node.children || [];
        //if (cardNodes.length >= 5) {
        //    return;
        //}
        //let remainCount = maxNumberCard - cardNodes.length;
        //
        //var selectedCards = this._selectedCardPrefabs(true) || [];
        //
        //if (selectedCards.length == 0) {
        //    return;
        //}
        //if (selectedCards.length > remainCount) {
        //    selectedCards = selectedCards.slice(0, remainCount);
        //}
        //
        //let selectedCardNames = selectedCards.map(function (cardPrefab) {
        //    return cardPrefab.getComponent('CardPrefab').cardName();
        //});
        //
        //cardNodes.forEach(function (cardTypeNode) {
        //    selectedCardNames.push(cardTypeNode.getComponent('CardTypeSprite').cardName());
        //});
        //
        //let cardModes = selectedCardNames.map(function (cardName,index) {
        //    return new KQCard(cardName,null,index);
        //}).sort(function (c1, c2) {
        //    return KQCard.sort(c1, c2, false);
        //});

        //let touCardModes = (node == this.layoutTouDao.node) ? cardModes : this._taoDaoCardModes();
        //let zhongCardModes = (node == this.layoutZhongDao.node) ? cardModes : this._zhongDaoCardModes();
        //let weiCardModes = (node == this.layoutWeiDao.node) ? cardModes : this._weiDaoCardModes();
        //if (!this._isValidCardModes(touCardModes, zhongCardModes, weiCardModes)) {
        //    this.cacleAutoSelectedCards1();
        //    cc.log('相公牌：自动选择牌')
        //    return;
        //}
        //
        //node.removeAllChildren();
        //
        //cardModes.forEach(function (cardMode,index) {
        //    let cardName = cardMode.cardName();
        //    let cardTypeSprite = cc.instantiate(this.cardTypePrefab);
        //    cardTypeSprite.names = cardName+'+'+index;
        //    cardTypeSprite.getComponent('CardTypeSprite').setCard(cardName,index);
        //    node.addChild(cardTypeSprite);
        //}.bind(this));
        //
        //
        //selectedCards.forEach(function (node) {
        //    node.removeFromParent();
        //});
        //this._resetCardsPositionY();
        //this._resetCardsPositionX();
        //
        //this._autoActiveDeleteDaoButtons();
        //
        //this._reloadKQCardModesInner();
        //this._resetTypeButtonEnablesWithModels();

        var maxNumberCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    },

    // 删除 头、中或尾道中的某中牌
    _deleteDaoCard: function _deleteDaoCard(cardTypeNode) {
        //let cardName = cardTypeNode.getComponent('CardTypeSprite').cardName();
        //this.addCard(cardName, true);
        //
        //this._resetCardsPositionY();
        //
        //cardTypeNode.removeFromParent(true);
        //this._autoActiveDeleteDaoButtons();
        //
        //if (reloadTypeButtonEnables) {
        //    this._reloadKQCardModesInner();
        //    this._resetTypeButtonEnablesWithModels();
        //}

        var reloadTypeButtonEnables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    },

    // 删除 头道或中道或尾道上所有的 牌
    _deleteDaoCardsOfLayout: function _deleteDaoCardsOfLayout(daoLayout) {
        //let cardNodes = Array.from(daoLayout.children);
        //cardNodes.forEach(this._deleteDaoCard.bind(this));
        //
        //this._reloadKQCardModesInner();
        //this._resetTypeButtonEnablesWithModels();
    },

    // 判断能否使用选择中的牌
    // 即：头道要小于中道、中道要小于尾道
    _isValidCardModes: function _isValidCardModes(touCardModes, zhongCardModes, weiCardModes) {
        touCardModes = touCardModes || [];
        zhongCardModes = zhongCardModes || [];
        weiCardModes = weiCardModes || [];
        if (touCardModes.length < 3 || zhongCardModes.length < 5 || weiCardModes.length < 5) {
            return true;
        }

        var touScore = KQCard.scoreOfCards(touCardModes);
        var zhongScore = KQCard.scoreOfCards(zhongCardModes);
        var weiScore = KQCard.scoreOfCards(weiCardModes);
        return touScore < zhongScore && zhongScore <= weiScore;
    },

    // 头道上已有的牌
    _taoDaoCardModes: function _taoDaoCardModes() {
        return this._cardModesOfCardPrefabs(this.cardAlls.slice(0, 3));
    },

    // 中道上已有的牌
    _zhongDaoCardModes: function _zhongDaoCardModes() {
        //return this._cardModesOfCardPrefabs(this.layoutZhongDao.node.children);
        return this._cardModesOfCardPrefabs(this.cardAlls.slice(3, 8));
    },

    // 尾道上已有的牌
    _weiDaoCardModes: function _weiDaoCardModes() {
        //return this._cardModesOfCardPrefabs(this.layoutWeiDao.node.children);
        return this._cardModesOfCardPrefabs(this.cardAlls.slice(8, 13));
    },

    _cardModesOfCardPrefabs: function _cardModesOfCardPrefabs(cardTypeNodes) {
        if (!cardTypeNodes) {
            return [];
        }

        var cardModes = cardTypeNodes.map(function (node) {
            //let component = node.getComponent('CardTypeSprite');
            //return component.cardMode();._cardModel
            return node._cardModel;
        });

        return cardModes || [];
    },

    // 自动设置 头、中、尾道的删除按钮的可见性
    _autoActiveDeleteDaoButtons: function _autoActiveDeleteDaoButtons() {
        //this._autoActiveDeleteDaoButton(this.layoutTouDao.node, this.btnDeleteTouDao.node);
        //this._autoActiveDeleteDaoButton(this.layoutZhongDao.node, this.btnDeleteZhongDao.node);
        //this._autoActiveDeleteDaoButton(this.layoutWeiDao.node, this.btnDeleteWeiDao.node);
    },

    _autoActiveDeleteDaoButton: function _autoActiveDeleteDaoButton(layout, button) {
        //button.active = layout.children.length > 0;
    },

    // 自动设置 “全部取消”、“确定出牌”、“类型选择”按钮的可见性
    _autoActiveTypeButtons: function _autoActiveTypeButtons() {
        //let cardNodes = this.cardsLayout.node.children || [];
        //let hasCardUnSelected = cardNodes.length > 0;
        //this.btnDone.node.active = !hasCardUnSelected;
        //this.btnCancelAll.node.active = this.btnDone.node.active;
        //this.typeButtonsNode.active = hasCardUnSelected;
    }

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=CardTypeCombine.js.map
        