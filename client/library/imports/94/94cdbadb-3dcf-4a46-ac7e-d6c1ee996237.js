var KQCard = require('KQCard');

cc.Class({
  'extends': cc.Component,

  properties: {
    graySprite: cc.Sprite,

    _cardName: null,
    _kqCardMode: null
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.graySprite.node.active = false;
  },

  // 通过牌名设置牌
  setCard: function setCard(cardName) {
    this._setCardName(cardName);

    this._loadCardFrame(cardName, (function (spriteFrame) {
      this.node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
    }).bind(this));
  },

  cardName: function cardName() {
    return this._cardName;
  },

  cardMode: function cardMode() {
    return this._kqCardMode;
  },

  _setCardName: function _setCardName(cardName) {
    this._cardName = cardName;
    this._kqCardMode = new KQCard(cardName);
  },

  // 设置选择状态
  setSelected: function setSelected() {
    var selected = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    this.graySprite.node.active = selected;
  },

  isSelected: function isSelected() {
    return this.graySprite.node.active;
  },

  _cardFullName: function _cardFullName(cardShortName) {
    var cardName = cardShortName;
    if (!cardName.startsWith("public-pic-card-poker")) {
      cardName = "public-pic-card-poker-" + cardName;
    }

    return cardName;
  },

  _loadCardFrame: function _loadCardFrame(cardName, callback) {
    cc.assert(callback);

    cc.loader.loadRes("play/CardTypeCombine/pockList", cc.SpriteAtlas, (function (err, atlas) {
      if (err) {
        cc.error(err);
        return;
      }

      cardName = this._cardFullName(cardName);
      var frame = atlas.getSpriteFrame(cardName);
      callback(frame);
    }).bind(this));
  }
});