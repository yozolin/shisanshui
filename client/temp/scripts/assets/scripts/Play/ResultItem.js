"use strict";
cc._RFpush(module, '9b2behcoUlLYL1MIMs+04wI', 'ResultItem');
// scripts\Play\ResultItem.js

var KQCardResHelper = require('KQCardResHelper');
var SpriteHelper = require('SpriteHelper');
var KQCard = require('KQCard');

cc.Class({
  'extends': cc.Component,

  properties: {
    avatarSprite: cc.Sprite,
    labelNickname: cc.Label,
    labelResultNumber: cc.Label,
    layoutTouDao: cc.Layout,
    layoutZhongDao: cc.Layout,
    layoutWeiDao: cc.Layout,
    layoutTeShu: cc.Layout,

    labelTeShuPaiTitle: cc.Label,

    scoreUnitNode: cc.Node, // 积分
    diamondUnitNode: cc.Node },

  // 钻石
  onLoad: function onLoad() {},

  //{"id":100049,"nickname":"imya","openId":"xx","avatarUrl":"xx","sex":1,
  // "cardNumber":3,"onlineStatus":1,"inviteCode":"","ipAddress":"::ffff:222.244.65.201",
  // "lastLoginTime":"2017-04-13 22:09:01","createAt":"2017-04-11 22:39:30",
  // "updateAt":"2017-04-13 22:09:01",
  // "cards":[],"roomId":"598883","readyStatus":true,"totalScore":0,
  // "cScore":0,"isBanker":false}
  updateWithPlayerInfo: function updateWithPlayerInfo(playerInfo) {
    var isRandomRoom = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    SpriteHelper.setImageUrl(this.avatarSprite, playerInfo.avatarUrl);
    this.labelNickname.string = playerInfo.nickname;
    //cc.log(this.labelResultNumber.string)
    //cc.log(playerInfo)
    //cc.log(playerInfo.cScore)
    //cc.log('---36')
    this.labelResultNumber.string = playerInfo.cScore;

    this.scoreUnitNode.active = !isRandomRoom;
    this.diamondUnitNode.active = isRandomRoom;
    var Number = playerInfo.cScore;
    if (isRandomRoom) {
      // 如果是随机场的话，则显示钻石数量
      Number = playerInfo.cScore * 5;
    }
    this.labelResultNumber.string = Number;
  },

  setCards: function setCards(cards) {
    cc.assert(cards.length == 13);

    // 不会再有特殊牌了
    /*if (KQCard.isTeShuPai(cards)) {
      this.setTeShuCards(cards);
      return;
      }
    */

    //let touCards = cards.slice(0, 3);
    //let zhongCards = cards.slice(3, 3 + 5);
    //let weiCards = cards.slice(8);
    //this.setTouCards(touCards);
    //this.setZhongCards(zhongCards);
    //this.setWeiCards(weiCards);
  }

});
/*setTouCards: function (cards) {
  this._setCardsToLayout(this.layoutTouDao, cards);
},
 setZhongCards: function (cards) {
  this._setCardsToLayout(this.layoutZhongDao, cards);
},
  setWeiCards: function (cards) {
  this._setCardsToLayout(this.layoutWeiDao, cards);
},*/

//结算  将特殊牌放入Layout
/*setTeShuCards: function (cards) {
  this.layoutTeShu.node.active = true;
  this.layoutTouDao.node.active = false;
  this.layoutZhongDao.node.active = false;
  this.layoutWeiDao.node.active = false;
  this._setCardsToLayout(this.layoutTeShu, cards);
   let typeName = KQCard.cardsTypeName(cards);
  this.labelTeShuPaiTitle.string = typeName;
},*/

//结算将牌放到Layout里面
/*_setCardsToLayout: function (layout, cards) {
  let node = layout.node;
  node.children.forEach(function (spriteNode, index) {
    let sprite = spriteNode.getComponent('cc.Sprite');
    let card = cards[index];
    if (!card) {
      return;
    }
     KQCardResHelper.setCardSpriteFrame(sprite, card.cardName());
  });
},*/

cc._RFpop();